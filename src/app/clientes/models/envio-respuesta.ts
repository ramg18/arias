/**
 * Respuesta del flujo de n8n tras una carga (facturas, comprobantes, nómina).
 * `normalizar` valida y recorta lo que llega de fuera: solo pasan los campos conocidos,
 * como texto o número acotado. Lo que no tiene la forma esperada devuelve null y la
 * pantalla cae al mensaje genérico de «enviado».
 */

export type EstadoArchivo = 'ok' | 'por_revisar' | 'repetida' | 'error';

export interface FacturaInfo {
  numero: string;
  proveedor: string;
  nit: string;
  fecha: string;
  total: number | null;
}

export interface ComprobanteInfo {
  archivo: string;
  fecha: string;
  valor: number | null;
  cuentaOrigen: string;
  cuentaDestino: string;
  banco: string;
}

export interface ResultadoArchivo {
  archivo: string;
  estado: EstadoArchivo;
  detalle: string;
  factura: FacturaInfo | null;
  comprobante: ComprobanteInfo | null;
  registroCompras: string[];
  // Nómina
  empleado: string;
  cedula: string;
  valor: number | null;
  periodo: string;
  driveUrl: string | null;
}

export interface ResumenEnvio {
  recibidas: number;
  ok: number;
  porRevisar: number;
  repetidas: number;
  errores: number;
}

export interface EnvioRespuesta {
  ok: boolean;
  resumen: ResumenEnvio;
  resultados: ResultadoArchivo[];
}

const MAX_RESULTADOS = 100;

function obj(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function str(v: unknown, max = 200): string {
  if (typeof v === 'string') return v.slice(0, max);
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return '';
}

function num(v: unknown): number | null {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : null;
}

function count(v: unknown): number | null {
  const n = num(v);
  return n !== null && n >= 0 ? Math.floor(n) : null;
}

function estado(v: unknown): EstadoArchivo {
  const s = str(v, 30).toLowerCase().trim();
  if (s === 'ok') return 'ok';
  if (s === 'repetida' || s === 'repetidas' || s === 'repetido' || s === 'duplicada') return 'repetida';
  if (s === 'error' || s === 'errores') return 'error';
  return 'por_revisar'; // estado desconocido: lo prudente es avisar que se revise
}

/** Solo enlaces https de Google Drive/Docs. */
export function driveSeguro(v: unknown): string | null {
  if (typeof v !== 'string' || v.length > 500) return null;
  try {
    const u = new URL(v);
    const hostOk = u.hostname === 'drive.google.com' || u.hostname === 'docs.google.com';
    return u.protocol === 'https:' && hostOk ? u.toString() : null;
  } catch {
    return null;
  }
}

function factura(v: unknown): FacturaInfo | null {
  const o = obj(v);
  if (!o) return null;
  return {
    numero: str(o['numero'], 60),
    proveedor: str(o['proveedor'], 150),
    nit: str(o['nit'], 30),
    fecha: str(o['fecha'], 10),
    total: num(o['total'])
  };
}

function comprobante(v: unknown): ComprobanteInfo | null {
  const o = obj(v);
  if (!o) return null;
  return {
    archivo: str(o['archivo'], 150),
    fecha: str(o['fecha'], 10),
    valor: num(o['valor']),
    cuentaOrigen: str(o['cuenta_origen'], 100),
    cuentaDestino: str(o['cuenta_destino'], 100),
    banco: str(o['banco'], 80)
  };
}

function resultado(v: unknown): ResultadoArchivo | null {
  const o = obj(v);
  if (!o) return null;
  const compras = Array.isArray(o['registro_compras']) ? o['registro_compras'].slice(0, 20).map(x => str(x, 120)).filter(Boolean) : [];
  return {
    archivo: str(o['archivo'], 150),
    estado: estado(o['estado']),
    detalle: str(o['detalle'], 400),
    factura: factura(o['factura']),
    comprobante: comprobante(o['comprobante']),
    registroCompras: compras,
    empleado: str(o['empleado'], 150),
    cedula: str(o['cedula'], 20),
    valor: num(o['valor']),
    periodo: str(o['periodo'], 20),
    driveUrl: driveSeguro(o['drive_url'])
  };
}

/** `raw` es el cuerpo que n8n devolvió (ya sin el envoltorio del proxy). */
export function normalizar(raw: unknown): EnvioRespuesta | null {
  const o = obj(raw);
  if (!o || !Array.isArray(o['resultados'])) return null;
  const resultados = o['resultados'].slice(0, MAX_RESULTADOS).map(resultado).filter((r): r is ResultadoArchivo => r !== null);
  if (resultados.length === 0) return null;

  // Los conteos salen de los resultados (fuente de verdad); del resumen de n8n solo se toma `recibidas`.
  const r = obj(o['resumen']) ?? {};
  const cuenta = (e: EstadoArchivo) => resultados.filter(x => x.estado === e).length;
  return {
    ok: o['ok'] !== false,
    resumen: {
      recibidas: count(r['recibidas']) ?? resultados.length,
      ok: cuenta('ok'),
      porRevisar: cuenta('por_revisar'),
      repetidas: cuenta('repetida'),
      errores: cuenta('error')
    },
    resultados
  };
}

export function nivelGeneral(r: EnvioRespuesta): 'success' | 'warning' | 'error' {
  if (!r.ok || r.resumen.errores > 0 || r.resultados.every(x => x.estado === 'error')) return 'error';
  if (r.resumen.porRevisar > 0 || r.resumen.repetidas > 0) return 'warning';
  return 'success';
}

/** Formato de pesos colombianos sin Intl (igual en servidor y navegador): $ 1.234.567 */
export function pesos(n: number | null): string {
  if (n === null) return '—';
  const neg = n < 0;
  const entero = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${neg ? '-' : ''}$ ${entero}`;
}

export function nitConPuntos(nit: string): string {
  return /^\d{6,}$/.test(nit) ? nit.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : nit;
}

export function cedulaEnmascarada(c: string): string {
  const digitos = c.replace(/\D/g, '');
  return digitos.length > 4 ? `••••${digitos.slice(-4)}` : c ? '••••' : '';
}
