const express = require('express');
const path = require('path');
const CookieObserver = require('../Tools/CookieObserver');
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { db } = require("../Tools/db");
const argon2 = require('argon2');

// use系
router.use(cookieParser());
router.use(express.json());

router.get("/", CookieObserver(), (req, res) => {
    // 0. Startup Log
    console.log("/Login-API is running!");

    // 1. 画面遷移
    return res.sendFile(path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html"));
});

router.post("/Submit", CookieObserver(), async (req, res) => {
    // 0. Startup Log
    console.log("/Login/Submit-API is running!");

    // 1. Login情報を取得する
    const userId = req.body.userId
    const password = req.body.password
    if (!userId || !password) return res.status(400).json({ error: "userId and password are required." });

    // 2. DB検索とサイドチャネル攻撃の対策
    const [userInfo] = await db.query("SELECT Password FROM Identify WHERE UserID = ?;", [userId]);
    const comparePassword = userInfo.length == 0 ? process.env.DUMMY_PASSWORD : userInfo[0].Password;
    
    // 3. hashの検証
    if (await argon2.verify(comparePassword, password + process.env.PEPPER)) {
        // Verify Success Log
        console.log("LoginToken is verified!");

        // cookieの項目を設定
        const status = { userId: userId };

        // cookieを準備
        const token = jwt.sign(status, process.env.LOGIN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign(status, process.env.LOGIN_REFRESH_SECRET, { expiresIn: '7d' });

        // cookieを返す
        res.cookie('LoginToken', token, { httpOnly: false, sameSite: 'strict' });
        res.cookie('LoginRefreshToken', refreshToken, { httpOnly: true });

        // リダイレクト
        res.redirect("/Home");
    }else{
        // Verify Error Log
        console.error("LoginToken is not verified!");
        return res.status(400).json({ error: 'ID or Password is failed.' });
    }
})

module.exports = router;