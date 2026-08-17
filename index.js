const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// CORS ပြဿနာရှင်းလင်းခြင်း
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, prefer, x-client-info');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

const targetUrl = 'https://winkfasmeiuvkckviqqc.supabase.co';

// Proxy လုပ်ဆောင်မည့် အပိုင်းကို Variable တစ်ခုအဖြစ် သတ်မှတ်ခြင်း
const apiProxy = createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  ws: true, // Websocket အတွက်
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
});

app.use('/', apiProxy);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});

// ⚠️ အရေးကြီး: Realtime Data (Websocket) တွေ အလုပ်လုပ်ဖို့ ဒီစာကြောင်း မပါမဖြစ် လိုအပ်ပါတယ် ⚠️
server.on('upgrade', apiProxy.upgrade);
