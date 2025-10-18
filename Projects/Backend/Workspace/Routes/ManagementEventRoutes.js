// トークンの秘密鍵
const LOGIN_SECRET = process.env.LOGIN_SECRET

// CookieObserverを通すのに必要な処理
const cookieObserver = require('../Tools/CookieObserver');

// ルータを使うのに必要な処理
const router = express.Router();

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const { db } = require("../Tools/db");

// cookieを使うのに必要な処理
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.use(express.json());

dotenv.config({ path: path.join(__dirname, "..", ".env") });

// ---- スタッフ専用ページ ----
router.get("/", cookieObserver(), async (req, res) => {
    // jsonウェブトークン
    const token = req.cookies.jwtToken;

    if (!token) return res.status(401).json({ message: "No token provided." });
    try {
        // デコードしたjsonウェブトークン
        const decodedToken = jwt.verify(token, LOGIN_SECRET);

        // jsonウェブトークンからユーザーID
        const userId = decodedToken.userId;

        // ユーザーIDで検索したユーザー情報
        const [userInfo] = await db.query("SELECT isStaff FROM AttendLog WHERE UserID = ?", [userId]);

        //ユーザーがスタッフである場合の処理
        if (parseInt(userInfo[0].isStaff) === 1) return res.redirect("/Contents");

        //ユーザーがスタッフでない場合の処理
        return res.status(403).json({ error: 'You are not staff.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

router.get("/Contents", cookieObserver(), async (req, res) => {
    if (!token) return res.status(401).json({ message: "No token provided." });
    try {
        // デコードしたjsonウェブトークン
        const decodedToken = jwt.verify(token, LOGIN_SECRET);

        // jsonウェブトークンから得たユーザーID
        const userId = decodedToken.userId;

        // ユーザーIDで検索したユーザー情報
        const [userInfo] = await db.query("SELECT isStaff FROM AttendLog WHERE UserID = ?", [userId]);

        if (parseInt(userInfo[0].isStaff) === 1) {
            // クリエパラメーターから取得したイベントID
            const eventId = req.params.EventID;

            const [Attend] = await db.query("SELECT * FROM AttendLog WHERE EventID = ?", [eventId]);
            const [Schedules] = await db.query("SELECT * FROM Schedules WHERE EventID = ?", [eventId]);
            return res.json({ Attend, Schedules });
        }
        else return res.status(403).json({ error: 'You are not staff.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

// ---- スケジュール更新 ----
router.post("/Update", cookieObserver(), async (req, res) => {
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    try {
        // デコードしたjsonウェブトークン
        const decodedToken = jwt.verify(token, LOGIN_SECRET);

        // jsonウェブトークンから得たユーザーID
        const userId = decodedToken.userId;

        // ユーザーIDで検索したユーザー情報
        const [userInfo] = await db.query("SELECT isStaff FROM AttendLog WHERE UserID = ?", [userId]);
        if (parseInt(userInfo[0].isStaff) !== 1) return res.status(403).json({ error: 'You are not staff.' });

        const events = req.body;
        if (!Array.isArray(events)) return res.status(400).json({ message: "Array expected" });

        for (const event of events) {
            const { EventID, Date, Time, Content } = event;
            if (!EventID || !Date || !Time || !Content) continue;

            await db.query(
                "INSERT INTO Schedules (EventID, Date, Time, Content) VALUES (?, ?, ?, ?)",
                [EventID, Date, Time, Content]
            );
        }

        return res.status(200).json({ message: "Events inserted" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
