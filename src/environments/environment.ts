export const environment = {
  production: false,
  url: 'http://localhost:8001/api/v1/',
  link: 'http://localhost:8001/uploads/',
  // Portal clientes: loginUrl es el proxy propio (server.ts / proxy.conf.js), nunca el CRM directo. uploadUrl también es el proxy propio (nunca el webhook de n8n directo).
  clientes: {
    loginUrl: '/api/clientes/login',
    uploadUrl: '/api/clientes/upload'
  }
};
