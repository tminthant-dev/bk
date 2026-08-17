const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// ၁။ CORS နှင့် Preflight (OPTIONS) ပြဿနာကို ရှင်းလင်းခြင်း
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, prefer, x-client-info');
  
  // Browser မှ လှမ်းစစ်သော OPTIONS request ဖြစ်ပါက ချက်ချင်း 200 (OK) ပြန်ပေးရန်
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// သင့်ရဲ့ မူလ Supabase URL
const targetUrl = 'https://winkfasmeiuvkckviqqc.supabase.co';

// ၂။ Proxy လုပ်ဆောင်ခြင်း
app.use('/', createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  ws: true, // Websocket အတွက်
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
