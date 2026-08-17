const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const corsOptions = {
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'apikey',
    'Authorization',
    'Content-Type',
    'X-Client-Info',
    'Prefer',
    'Range'
  ],
  exposedHeaders: ['Content-Range']
};

// CORS
app.use(cors(corsOptions));

// Preflight
app.options('*', cors(corsOptions));


// =========================
// Supabase Proxy
// =========================

const targetUrl = 'https://winkfasmeiuvkckviqqc.supabase.co';

const apiProxy = createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  ws: true,

  onProxyRes: (proxyRes, req, res) => {
    const origin = req.headers.origin;

    if (
      origin === 'http://127.0.0.1:5500' ||
      origin === 'http://localhost:5500'
    ) {
      proxyRes.headers['access-control-allow-origin'] = origin;
    }

    proxyRes.headers['access-control-allow-methods'] =
      'GET,POST,PUT,PATCH,DELETE,OPTIONS';

    proxyRes.headers['access-control-allow-headers'] =
      'apikey,Authorization,Content-Type,X-Client-Info,Prefer,Range';

    proxyRes.headers['access-control-expose-headers'] =
      'Content-Range';
  }
});

app.use('/', apiProxy);


// =========================
// Server
// =========================

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});

server.on('upgrade', apiProxy.upgrade);