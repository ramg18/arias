export const environment = {
  production: true,
  url: 'https://apicopiloto.koudelagency.cloud/api/v1/',
  link: 'https://apicopiloto.koudelagency.cloud/uploads/',
  // Portal clientes: loginUrl es el proxy propio (server.ts / proxy.conf.js), nunca el CRM directo. uploadUrl también es el proxy propio (nunca el webhook de n8n directo).
  clientes: {
    loginUrl: '/api/clientes/login',
    uploadUrl: '/api/clientes/upload'
  }
};
