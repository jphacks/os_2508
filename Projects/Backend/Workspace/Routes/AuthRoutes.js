const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const InverseCookieObserver = require('../Tools/InverseCookieObserver');

router.get("/", InverseCookieObserver(), (req, res) => {
    // 0. Startup Log
    console.log("/Auth-API is running!");

    // 1. 画面遷移
    return res.sendFile(path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html"));
});

router.post("/CheckAuth", InverseCookieObserver(), (req, res) => {
    // 0. Startup Log
    console.log("/Auth/CheckAuth-API is running!");

    // 1. ユーザーからのInvitedKeyと.envからのInvitedKeyをそれぞれ取得する。
    const invitedKey = req.body.invitedKey    // ユーザーが入力した招待コード
    const INVITED_KEY = process.env.INVITED_KEY    // .envから取得した招待コード

    // 2. それぞれを比較する
    if (invitedKey === INVITED_KEY) {
        // VerifySuccessLog
        console.log("InvitedKey is verified!");
        
        // statusを準備
        const status = { status: "success" };

        // .envから秘密鍵を取得
        const AUTH_SECRET = process.env.AUTH_SECRET    //.env内のトークンの秘密鍵
        const AUTH_REFRESH_SECRET = process.env.AUTH_REFRESH_SECRET    //.env内のリフレッシュトークンの秘密鍵

        // tokenの作成
        const token = jwt.sign(status, AUTH_SECRET, { expiresIn: '1h' });    // トークンの準備
        const refreshToken = jwt.sign(status, AUTH_REFRESH_SECRET, { expiresIn: '7d' });    // リフレッシュトークンの準備

        //cookie返却
        res.cookie('InvitedToken', token, { httpOnly: false, sameSite: 'strict', expiresIn: '1h' });
        res.cookie('InvitedRefreshToken', refreshToken, { httpOnly: true, expiresIn: '90d' });

        // Homeにredirectする
        return res.redirect("/Home")
    } else {
        // VerifyErrorLog
        console.error("InvitedKey is not verified!");

        // ユーザーにエラーを返す
        return res.status(401).json({ message: "Unauthorized." });
    }
});

module.exports = router;