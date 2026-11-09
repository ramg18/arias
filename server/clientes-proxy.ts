import * as express from 'express';

/**
 * Proxy hacia el CRM (Accesos de clientes). La X-API-Key vive solo aquí,
 * nunca en el bundle del navegador.
 *
 * Variables de entorno:
 *   CRM_BASE_URL  ej. https://crm.ejemplo.com/external/client-access (sin "/" final)
 *   CRM_API_KEY   llave cmk_… de Accesos de clientes → Integraciones
 */

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 10;
const hits = new Map<string, { count: number; start: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(key, { count: 1, start: now });
    return false;
  }
  entry.count++;
  return entry.count > MAX_ATTEMPTS;
}

// Limpieza periódica para que el Map no crezca sin límite.
setInterval(() => {
  const now = Date.now();
  hits.forEach((v, k) => { if (now - v.start > WINDOW_MS) hits.delete(k); });
}, WINDOW_MS).unref();

export function clientesRouter(): express.Router {
  const router = express.Router();
  router.use(express.json({ limit: '10kb' }));

  router.post('/login', async (req, res) => {
    const base = process.env['CRM_BASE_URL'];
    const apiKey = process.env['CRM_API_KEY'];
    if (!base || !apiKey) {
      console.error('[clientes] CRM_BASE_URL / CRM_API_KEY no configuradas');
      return res.status(503).json({ allowed: false, reason: 'not_configured' });
    }

    if (rateLimited(req.ip ?? 'unknown')) {
      return res.status(429).json({ allowed: false, reason: 'too_many_attempts' });
    }

    const { email, password } = req.body ?? {};
    const valid =
      typeof email === 'string' && email.length > 0 && email.length <= 200 &&
      typeof password === 'string' && password.length >= 1 && password.length <= 200;
    if (!valid) {
      return res.status(400).json({ allowed: false, reason: 'invalid_body' });
    }

    try {
      // fetch/AbortSignal.timeout existen en Node >= 18 (Dockerfile); @types/node 16 no los tipa.
      const g = globalThis as any;
      const crm = await g.fetch(`${base}/login`, {
        method: 'POST',
        headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: g.AbortSignal.timeout(10_000)
      });

      if (crm.status === 401) {
        // Llave mala: error de configuración nuestro, no del cliente.
        console.error('[clientes] CRM rechazó la X-API-Key (401)');
        return res.status(502).json({ allowed: false, reason: 'upstream_error' });
      }

      const body = await crm.json().catch(() => ({}));
      return res.status(crm.status).json(body);
    } catch (err) {
      console.error('[clientes] error llamando al CRM:', (err as Error).message);
      return res.status(502).json({ allowed: false, reason: 'upstream_error' });
    }
  });

  return router;
}
