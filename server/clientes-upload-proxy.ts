import * as express from 'express';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';

/**
 * Proxy de envío de archivos hacia el webhook de n8n.
 *
 *   Navegador --(multipart + Bearer accessToken)--> este servidor --(multipart + x-api-key)--> n8n
 *
 * - Antes de reenviar nada, pregunta al CRM (POST /check) si el accessToken es válido y la persona sigue
 *   habilitada. No hay secretos que compartir con el CRM: se usa la misma CRM_API_KEY del login.
 * - La x-api-key de n8n vive solo aquí. La respuesta JSON de n8n se devuelve al navegador como `data` (máx. 1 MB).
 * - El cuerpo multipart (tipo, usuario, archivos) se reenvía en streaming, sin tocarlo.
 * - Añade X-User-Id y X-Client-Id tomados de la respuesta del CRM: esos dos sí son confiables
 *   en n8n; los campos del formulario (incl. `usuario`) los envía el navegador.
 * - El Authorization del cliente se reenvía a n8n, que lo exige.
 *
 * Variables de entorno:
 *   CRM_BASE_URL     ej. https://apicrm.ejemplo.com/external/client-access (sin "/" final)
 *   CRM_API_KEY      llave cmk_… de Accesos de clientes → Integraciones
 *   N8N_WEBHOOK_URL  URL completa del webhook de n8n
 *   N8N_API_KEY      valor del header x-api-key del webhook
 */

const MAX_BYTES = 60 * 1024 * 1024; // 60 MB por petición (varios xml + varias imágenes; la UI limita a 50 MB)
const MAX_RESPONSE_BYTES = 1024 * 1024; // respuesta de n8n que se reenvía al navegador
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const CHECK_TIMEOUT_MS = 10_000;
const hits = new Map<string, { count: number; start: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const e = hits.get(key);
  if (!e || now - e.start > WINDOW_MS) {
    hits.set(key, { count: 1, start: now });
    return false;
  }
  e.count++;
  return e.count > MAX_PER_WINDOW;
}
setInterval(() => {
  const now = Date.now();
  hits.forEach((v, k) => { if (now - v.start > WINDOW_MS) hits.delete(k); });
}, WINDOW_MS).unref();

type CheckResult =
  | { ok: true; userId: string; clientId: string }
  | { ok: false; reason: 'unauthorized' | 'upstream_error' };

/** Pregunta al CRM si el token vale. Una suspensión o revocación en el CRM rige desde la siguiente subida. */
async function checkToken(token: string): Promise<CheckResult> {
  const base = process.env['CRM_BASE_URL'];
  const apiKey = process.env['CRM_API_KEY'];
  if (!base || !apiKey) return { ok: false, reason: 'upstream_error' };

  try {
    // fetch/AbortSignal.timeout existen en Node >= 18 (Dockerfile); @types/node 16 no los tipa.
    const g = globalThis as any;
    const res = await g.fetch(`${base}/check`, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      signal: g.AbortSignal.timeout(CHECK_TIMEOUT_MS)
    });

    if (res.status === 401) {
      // Llave mala: error de configuración nuestro, no del cliente.
      console.error('[clientes/upload] CRM rechazó la X-API-Key (401)');
      return { ok: false, reason: 'upstream_error' };
    }
    // 400 = token mal formado; cualquier otro código no esperado también se trata como no autorizado.
    if (res.status === 400) return { ok: false, reason: 'unauthorized' };
    if (res.status >= 500) return { ok: false, reason: 'upstream_error' };

    const body = await res.json().catch(() => null);
    if (!body || body.allowed !== true) return { ok: false, reason: 'unauthorized' };

    const userId = body.user?.id;
    const clientId = body.user?.client?.id;
    // Estos valores van a headers: solo caracteres seguros.
    if (typeof userId !== 'string' || typeof clientId !== 'string' || !/^[\w-]+$/.test(userId) || !/^[\w-]+$/.test(clientId)) {
      return { ok: false, reason: 'unauthorized' };
    }
    return { ok: true, userId, clientId };
  } catch (err) {
    console.error('[clientes/upload] error consultando al CRM:', (err as Error).message);
    return { ok: false, reason: 'upstream_error' };
  }
}

export function clientesUploadRouter(): express.Router {
  const router = express.Router();

  router.post('/upload', async (req, res): Promise<void> => {
    const webhook = process.env['N8N_WEBHOOK_URL'];
    const apiKey = process.env['N8N_API_KEY'];
    if (!webhook || !apiKey) {
      console.error('[clientes/upload] N8N_WEBHOOK_URL / N8N_API_KEY no configuradas');
      res.status(503).json({ ok: false, reason: 'not_configured' });
      return;
    }
    if (!process.env['CRM_BASE_URL'] || !process.env['CRM_API_KEY']) {
      console.error('[clientes/upload] CRM_BASE_URL / CRM_API_KEY no configuradas');
      res.status(503).json({ ok: false, reason: 'not_configured' });
      return;
    }

    if (rateLimited(req.ip ?? 'unknown')) {
      res.status(429).json({ ok: false, reason: 'too_many_requests' });
      return;
    }

    // 1) Forma de la petición (rechazos baratos, antes de preguntar al CRM)
    const auth = req.headers.authorization ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) {
      res.status(401).json({ ok: false, reason: 'unauthorized' });
      return;
    }
    const contentType = req.headers['content-type'] ?? '';
    if (!contentType.startsWith('multipart/form-data')) {
      res.status(415).json({ ok: false, reason: 'unsupported_media_type' });
      return;
    }
    const length = Number(req.headers['content-length']);
    if (!Number.isFinite(length) || length <= 0) {
      res.status(411).json({ ok: false, reason: 'length_required' });
      return;
    }
    if (length > MAX_BYTES) {
      res.status(413).json({ ok: false, reason: 'too_large' });
      return;
    }

    // 2) Autenticación contra el CRM
    const check = await checkToken(token);
    if (!check.ok) {
      res.status(check.reason === 'unauthorized' ? 401 : 502).json({ ok: false, reason: check.reason });
      return;
    }
    if (req.destroyed) return; // el navegador cortó mientras se consultaba al CRM

    // 3) Reenvío en streaming
    let target: URL;
    try {
      target = new URL(webhook);
    } catch {
      console.error('[clientes/upload] N8N_WEBHOOK_URL inválida');
      res.status(503).json({ ok: false, reason: 'not_configured' });
      return;
    }
    const send = target.protocol === 'https:' ? httpsRequest : httpRequest;

    let done = false;
    const finish = (status: number, body: object) => {
      if (done) return;
      done = true;
      res.status(status).json(body);
    };

    const upstream = send(
      {
        hostname: target.hostname,
        port: target.port || undefined,
        path: target.pathname + target.search,
        method: 'POST',
        timeout: 60_000,
        headers: {
          'content-type': contentType,
          'content-length': length,
          'x-api-key': apiKey,
          authorization: auth,
          'x-user-id': check.userId,
          'x-client-id': check.clientId
        }
      },
      upstreamRes => {
        // Se lee la respuesta de n8n (con tope) para devolverla como `data`: la pantalla muestra el resultado del registro.
        const chunks: Buffer[] = [];
        let size = 0;
        let tooBig = false;
        upstreamRes.on('data', (c: Buffer) => {
          size += c.length;
          if (size > MAX_RESPONSE_BYTES) tooBig = true;
          else chunks.push(c);
        });
        upstreamRes.on('end', () => {
          const ok = (upstreamRes.statusCode ?? 500) < 300;
          if (!ok) {
            console.error('[clientes/upload] n8n respondió', upstreamRes.statusCode);
            finish(502, { ok: false, reason: 'upstream_error' });
            return;
          }
          let data: unknown = null;
          if (!tooBig) {
            try {
              data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
            } catch {
              data = null; // n8n respondió algo que no es JSON: el navegador mostrará el mensaje genérico
            }
          }
          finish(200, { ok: true, data });
        });
      }
    );

    upstream.on('timeout', () => upstream.destroy(new Error('timeout')));
    upstream.on('error', err => {
      console.error('[clientes/upload] error hacia n8n:', err.message);
      finish(502, { ok: false, reason: 'upstream_error' });
    });

    // Corta si el cuerpo real excede lo declarado en content-length.
    let received = 0;
    req.on('data', (chunk: Buffer) => {
      received += chunk.length;
      if (received > MAX_BYTES) {
        upstream.destroy();
        finish(413, { ok: false, reason: 'too_large' });
        req.unpipe(upstream);
        req.resume();
      }
    });

    req.pipe(upstream);
  });

  return router;
}
