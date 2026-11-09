export const environment = {
  url: 'https://blog.ariasyasociados.co/api/',
  link: 'https://blog.ariasyasociados.co/storage/',
  // url: 'http://blogarias.test/api/',
  // link: 'http://blogarias.test/storage/'
  // Portal clientes: loginUrl es el proxy propio (server.ts / proxy.conf.js), nunca el CRM directo. uploadUrl también es el proxy propio (nunca el webhook de n8n directo).
  clientes: {
    loginUrl: '/api/clientes/login',
    uploadUrl: '/api/clientes/upload'
  }
};
