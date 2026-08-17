const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// ၁။ CORS ကို အစောဆုံးနှင့် အတိအကျ သတ်မှတ်ခြင်း
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'apikey', 'prefer', 'x-client-info', 'range'],
  credentials: true
}));

// ၂။ OPTIONS (Preflight) request အားလုံးကို ချက်ချင်း 200 OK ပြန်ပေးရန်
app.options('*', cors());

// ၃။ Supabase Proxy သတ်မှတ်ခြင်း
const targetUrl = 'https://winkfasmeiuvkckviqqc.supabase.co';
const apiProxy = createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  ws: true,
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, apikey, prefer, x-client-info, range';
  }
});

app.use('/', apiProxy);

// ၄။ Server စတင်ခြင်း
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});

server.on('upgrade', apiProxy.upgrade);
