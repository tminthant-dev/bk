const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// CORS ပြဿနာမတက်အောင် ဖွင့်ပေးထားခြင်း
app.use(cors());

// Supabase Project URL
const targetUrl = 'https://winkfasmeiuvkckviqqc.supabase.co';

// Proxy လုပ်ဆောင်မည့် အပိုင်း
app.use('/', createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

// Railway က သတ်မှတ်ပေးမည့် PORT သို့မဟုတ် 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
