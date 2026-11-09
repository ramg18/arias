/**
 * Proxy de `ng serve`: replica en desarrollo lo que hacen server/clientes-proxy.ts
 * y server/clientes-upload-proxy.ts en producción.
 *
 * Configuración: crea `.env.local` (copia de `.env.example`). También sirven variables
 * de entorno ya definidas en la terminal. `.env.local` está en .gitignore: las llaves
 * nunca deben subirse al repo.
 *
 * Ojo: este proxy de desarrollo NO verifica el accessToken (eso lo hace el servidor de
 * producción preguntando al CRM con POST /check); solo añade las llaves.
 */
const fs = require('fs');
const path = require('path');

function loadEnvFile(file) {
  const full = path.join(__dirname, file);
  if (!fs.existsSync(full)) return;
  fs.readFileSync(full, 'utf8').split(/\r?\n/).forEach(line => {
    if (line.trim().startsWith('#')) return;
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m) return;
    if (process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  });
}

loadEnvFile('.env.local');

if (!process.env.CRM_API_KEY) {
  console.warn('[proxy] CRM_API_KEY no definida: el login de clientes devolverá 401. Ver .env.example');
}

// --- Subida de archivos -> webhook de n8n ---
let uploadTarget = 'http://localhost:1'; // inalcanzable a propósito si no hay webhook configurado
let uploadPath = () => '/';
if (process.env.N8N_WEBHOOK_URL) {
  const u = new URL(process.env.N8N_WEBHOOK_URL);
  uploadTarget = u.origin;
  uploadPath = () => u.pathname + u.search;
} else {
  console.warn('[proxy] N8N_WEBHOOK_URL no definida: el envío de archivos fallará. Ver .env.example');
}

// IMPORTANTE: la ruta más específica (/upload) va antes que /api/clientes (CRM),
// para que los archivos nunca se envíen al CRM por accidente.
module.exports = {
  '/api/clientes/upload': {
    target: uploadTarget,
    changeOrigin: true,
    secure: false,
    pathRewrite: uploadPath,
    headers: { 'x-api-key': process.env.N8N_API_KEY || '' }
  },
  '/api/clientes': {
    target: process.env.CRM_BASE_URL || 'http://localhost:4000/external/client-access',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/api/clientes': '' },
    headers: { 'X-API-Key': process.env.CRM_API_KEY || '' }
  }
};
