// CookieObserverを通すのに必要な処理
const CookieObserver = require('../Tools/CookieObserver');
const express = require('express');
const router = express.Router();
const path = require('path');
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const { db } = require("../Tools/db");

// cookieを使うのに必要な処理
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(express.json());
dotenv.config({ path: path.join(__dirname, "..", ".env") });

router.get("/", CookieObserver(), (req, res) => {
    // 0. Startup Log
    console.log("/Profile-API is running!");

    // 1. 画面遷移
    return res.sendFile(path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html"));
});

router.get("/Fetch", CookieObserver(), async (req, res) => {
    // 0. Startup Log
    console.log("/Profile/Fetch-API is running!");

    // トークンの秘密鍵
    const LOGIN_SECRET = process.env.LOGIN_SECRET

    // トークン
    const token = req.cookies.LoginToken;

    if (!token) {
        console.log("token not found...");
        return res.status(401).json({ message: "token not found..." });
    }
    try {
        // デコードしたトークン
        const decodeToken = jwt.verify(token, LOGIN_SECRET);

        // cookieから取得したユーザーID
        const userId = decodeToken.userId;

        // ユーザーIDで検索したそのユーザーの情報
        const [userInfo] = await db.query("SELECT * FROM Profiles WHERE UserID = ?", [userId]);

        if (!userInfo) return res.status(404).json({ message: "Not Found." });
        // ユーザーの情報をjsonの形で返却
        const userData = {
            userId: userInfo[0].UserID,
            nickName: userInfo[0].Nickname,
            birth: userInfo[0].Birthday ? userInfo[0].Birthday.getTime() : null,
            gradYear: userInfo[0].Graduation?.toString() || "",
            organization: userInfo[0].Organization || "",
            events: "",
            comment: userInfo[0].Comment || ""
        };
        return res.json({ userData });
    } catch (err){
        console.error("token not verified...",err);
        return res.status(401).json({ message: "Unauthorized.(try-catch)" });
    }
});

router.get("/:UserID", CookieObserver(), (req, res) => {
    // 0. Startup Log
    console.log("/Profile/:UserID-API is running!");

    // 1. 画面遷移
    return res.sendFile(path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html"));
});

router.get("/:UserID/Fetch", CookieObserver(), async (req, res) => {
    // 0. Startup Log
    console.log("/Profile/:UserID/Fetch-API is running!");

    // クリエパラメーターから取得したユーザーID
    const UserID = req.params.UserID

    // ユーザーIDで検索したそのユーザーの情報
    const [userInfo] = await db.query("SELECT * FROM Profiles WHERE UserID = ?", [UserID]);

    if (!userInfo) return res.status(404).json({ message: "Not Found." });
    // ユーザーの情報をjsonの形で返却
    // ユーザーの情報をjsonの形で返却
    const userData = {
        userId: userInfo[0].UserID,
        nickName: userInfo[0].Nickname,
        birth: userInfo[0].Birthday ? userInfo[0].Birthday.getTime() : null,
        gradYear: userInfo[0].Graduation?.toString() || "",
        organization: userInfo[0].Organization || "",
        events: "",
        comment: userInfo[0].Comment || ""
    };
    return res.json({ userData });
});

module.exports = router;