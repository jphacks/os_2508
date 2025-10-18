const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();
const cookieParser = require("cookie-parser");
const CookieObserver = require('./Tools/CookieObserver');
const app = express();

// use系を使う
app.use(express.json()); // json解析してreq.bodyに自動的に格納する。(Formで送られた物以外)
app.use(cookieParser()); // cookie解析してreq.cookiesに自動的に格納する。
app.use(express.urlencoded({ extended: true })); // POSTされたformの内容を解析してreq.bodyに自動的に格納する。

// ページの配信(Reactでbuild予定)
app.use(express.static(path.join(__dirname, "..", "..", "..", "Frontend", "dist")));

// ルーティング(申請してくれたら追加します)
// AuthRouting
const authRoutes = require('./Routes/AuthRoutes');
app.use("/Auth", authRoutes);

// HomeRouting
app.get("/Home", CookieObserver(), (req, res) => {
    // 0. Startup Log
    console.log("/Auth/CheckAuth-API is running!");

    // 1. 画面遷移
    return res.sendFile(path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html"));
});

// PORT番号を.envから取得
const PORT = process.env.PORT || 5000;

// Serverを起動
app.listen(PORT, '0.0.0.0', () => console.log(`Server running at http://localhost:${PORT}`))