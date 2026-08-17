const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',

  // Production မှာ မင်း hosting domain ကို ဒီနေရာထည့်
  // 'https://your-domain.com'
];

// ===============================
// CORS
// ===============================
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'apikey, Authorization, Content-Type, X-Client-Info, Prefer, Range'
  );

  res.setHeader('Access-Control-Expose-Headers', 'Content-Range');

  // Preflight request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});


// ===============================
// Supabase Proxy
// ===============================

const targetUrl = 'https://winkfasmeiuvkckviqqc.supabase.co';

const apiProxy = createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,

  ws: true,

  onProxyRes: (proxyRes, req, res) => {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
      proxyRes.headers['access-control-allow-origin'] = origin;
    }

    proxyRes.headers['access-control-allow-methods'] =
      'GET, POST, PUT, PATCH, DELETE, OPTIONS';

    proxyRes.headers['access-control-allow-headers'] =
      'apikey, Authorization, Content-Type, X-Client-Info, Prefer, Range';

    proxyRes.headers['access-control-expose-headers'] =
      'Content-Range';
  }
});

app.use('/', apiProxy);

// ===============================
// Server
// ===============================
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
// ===============================
// WebSocket / Supabase Realtime
// ===============================

server.on('upgrade', apiProxy.upgrade);