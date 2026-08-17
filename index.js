const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// ၁။ CORS အားလုံးကို အတင်းအကျပ် လက်ခံခိုင်းခြင်း (Manual Override)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  // Header အားလုံးကို လက်ခံရန် (Supabase က တောင်းသမျှ အကုန်ရစေရန်)
  res.setHeader('Access-Control-Allow-Headers', '*'); 

  // ⚠️ အရေးကြီးဆုံး: OPTIONS request လာပါက Proxy ဆီ ဆက်မပို့ဘဲ ချက်ချင်း 200 (OK) ပြန်ပေးရန်
  if (req.method === 'OPTIONS') {
    return res.status(200).send('ok');
  }
  
  next();
});

// ၂။ Supabase Proxy ချိတ်ဆက်ခြင်း
const targetUrl = 'https://winkfasmeiuvkckviqqc.supabase.co';

const apiProxy = createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  ws: true, // Websocket အတွက်
  onProxyRes: function (proxyRes, req, res) {
    // Supabase ကနေ Data ပြန်လာတဲ့အခါမှာလည်း CORS Header အမြဲပါအောင် အတင်းထည့်ခြင်း
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
});

app.use('/', apiProxy);

// ၃။ Server လွှင့်ခြင်း
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
// ၄။ Websocket Connection (Realtime) ဖြတ်သန်းခွင့်ပေးခြင်း
server.on('upgrade', apiProxy.upgrade);
