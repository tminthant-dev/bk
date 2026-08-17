const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors());

const targetUrl = 'https://winkfasmeiuvkckviqqc.supabase.co';

app.use('/', createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  ws: true, // ⚠️ ဒီစာကြောင်းလေး အသစ်ထပ်ထည့်လိုက်တာပါ (Websocket အတွက်)
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});