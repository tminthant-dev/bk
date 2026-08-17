const express = require('express');
const cors = require('cors'); // ⚠️ ဤနေရာတွင် cors ကို ထည့်သွင်းထားပါသည်
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// ၁။ ပြီးပြည့်စုံသော CORS စနစ် (OPTIONS 404 Error ကို အမြစ်ပြတ်ရှင်းရန်)
app.use(cors({
  origin: '*', // မည်သည့် Domain ကမဆို လှမ်းခေါ်ခွင့်ပြုရန်
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  // Supabase အတွက် မပါမဖြစ် လိုအပ်သော Header များအားလုံးကို ခွင့်ပြုထားခြင်း
  allowedHeaders: ['Content-Type', 'Authorization', 'apikey', 'prefer', 'x-client-info', 'range']
}));

// ၂။ Proxy သတ်မှတ်ခြင်း
const targetUrl = 'https://winkfasmeiuvkckviqqc.supabase.co';
const apiProxy = createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  ws: true, // Websocket (Realtime) အတွက်
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
});

app.use('/', apiProxy);

// ၃။ Server စတင်ခြင်း
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});

// ၄။ Websocket ဖြတ်သန်းခွင့် အပြည့်အဝ ပေးခြင်း (User App Data မတက်သော ပြဿနာကို ရှင်းရန်)
server.on('upgrade', apiProxy.upgrade);
