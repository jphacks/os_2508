const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const CookieObserver = require('../Tools/CookieObserver');
const CheckStatus = require('../Tools/CheckStatus');
const { db } = require("../Tools/db");
const dotenv = require('dotenv');

//use系
router.use(cookieParser());
dotenv.config({ path: path.join(__dirname, "..", ".env") });

router.get("/", CookieObserver(), async (req, res) => {
    // 0. Startup Log
    console.log("/Event-API is running!");

    // 1. 画面遷移
    return res.sendFile(path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html"));
});

router.get("/Fetch", CookieObserver(), async (req, res) => {
    // 0. Startup Log
    console.log("/Event/Fetch-API is running!");

    // 1. Cookieから情報を取得
    const token = req.cookies?.LoginToken;

    // 2. tokenがあった場合、改ざんの形跡がないか検証
    try{
        // tokenの改ざんがないか検証
        jwt.verify(token, process.env.LOGIN_SECRET);
        // Verify Success Log
        console.log("LoginToken is verified!");

        // isOrganizerの確認
        const isOrganizer = await CheckStatus(token, "isOrganizer");
        console.log("isOrganizer:", isOrganizer);
        // DBからEvent情報の読み出し
        const [eventsQuick] = await db.query("SELECT EventName, EventID, StartDateTime, EndDateTime, EntryFee FROM Events WHERE NOW() <= StartDateTime;");
        console.log("eventsQuick:", eventsQuick);
        // 各必要な情報を送り返す
        return res.json({
            isOrganizer: isOrganizer,
            EventsData: eventsQuick
        })
    }catch(err){
        // Verify Error Log
        console.error("LoginToken is not verified!", err);
        // 検証に問題があった瞬間エラー
        return res.status(401).json({message: "Unauthorized."});
    }
});

router.get("/:EventID", CookieObserver(), async (req, res) => {
    // 0. Startup Log
    console.log("/Event/:EventID-API is running!");

    // 1. 画面遷移
    return res.sendFile(path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html"));
});

router.get("/:EventID/Fetch", CookieObserver(), async (req, res) => {
    // 0. Startup Log
    console.log("/Event/:EventID/Fetch-API is running!");

    // 1. EventIDの読み出し
    const eventId = req.params.EventID;

    // 2. Cookieから情報を取得
    const token = req.cookies?.LoginToken;

    // 3. tokenがあった場合、改ざんの形跡がないか検証
    try{
        // tokenの改ざんがないか検証
        jwt.verify(token, process.env.LOGIN_SECRET);
        // Verify Success Log
        console.log("LoginToken is verified!");

        // isOrganizerの確認
        const isStaff = await CheckStatus(token, "isStatus", eventId);
        console.log("isStaff:", isStaff);
        // DBからEvent情報の読み出し
        const [eventInfo] = await db.query("SELECT * FROM Events WHERE EventID = ? AND NOW() <= StartDateTime;", [eventId]);
        console.log("eventInfo:", eventInfo);
        // 各必要な情報を送り返す
        return res.json({
            isStaff: isStaff,
            EventsData: eventInfo
        })
    }catch(err){
        // Verify Error Log
        console.error("LoginToken is not verified!", err);
        // 検証に問題があった瞬間エラー
        return res.status(401).json({message: "Unauthorized."});
    }
});

router.get("/:EventID/Application", CookieObserver(), async (req, res) => {
    // 1. Cookieから情報を取得
    const token = req.cookies?.LoginToken;
    // tokenがなかった瞬間Authへ飛ばす
    if (!token) return res.status(401).json({ message: "No token provided." });

    // 2. Tokenのdecodeと情報の読み出し
    const decodedToken = jwt.verify(token, process.env.LOGIN_SECRET);
    const userId = decodedToken.userId;

    // 3. EventIDの取り出し
    const eventId = req.params.EventID;

    // 4. 申込期限の確認
    const [event] = await db.query("SELECT ApplicationLimit FROM Events WHERE EventID = ?", [eventId]);
    // DB Log
    console.log("Event fetched from DB:", event);
    // エラー対応
    if (event.length === 0) return res.status(404).json({ message: "Event not found" });

    // 5. 申込期限の取得
    const applicationLimit = new Date(event[0].ApplicationLimit);
    console.log("DEBUG ApplicationLimit:", applicationLimit);

    // 6. 現在時刻の取得
    const now = new Date();
    console.log("DEBUG Now:", now);
    // 申し込み期限の確認
    if (now > applicationLimit) return res.status(400).json({ message: `${now} > ${applicationLimit}` });

    // 7. すでに出席登録されていないか確認する
    const [attend] = await db.query("SELECT UserID, isStaff FROM AttendLogs WHERE EventID = ? AND UserID = ?", [eventId, userId]);
    if (attend.length == 0) { // isStaffの場合も出席登録しといてね
        await db.query("INSERT INTO AttendLogs (UserID, EventID, isStaff, Status) VALUES (?, ?, ?, ?)", [userId, eventId, 0, 0]);
        // DB Log
        console.log("Attend insert into DB:", attend);
        return res.status(200).json({ message: "Attendance registered" });
    } else return res.status(409).json({ message: "AttendLog data conflicted..." });
});

router.get("/:EventID/Cancel", CookieObserver(), async (req, res) => {
    // 1. Cookieから情報を取得
    const token = req.cookies?.LoginToken;
    // tokenがなかった瞬間Authへ飛ばす
    if (!token) return res.status(401).json({ message: "No token provided." });

    // 2. Tokenのdecodeと情報の読み出し
    const decodedToken = jwt.verify(token, process.env.LOGIN_SECRET);
    const userId = decodedToken.userId;

    // 3. EventIDの取り出し
    const eventId = req.params.EventID;

    // 4. 申込期限の確認
    const [event] = await db.query("SELECT CancelLimit FROM Events WHERE EventID = ?", [eventId]);
    // DB Log
    console.log("Event fetched from DB:", event);
    // エラー対応
    if (event.length === 0) return res.status(404).json({ message: "Event not found" });

    // 5. 申込期限の取得
    const cancelLimit = new Date(event[0].CancelLimit);
    console.log("DEBUG CancelLimit:", cancelLimit);

    // 6. 現在時刻の取得
    const now = new Date();
    console.log("DEBUG Now:", now);
    // 申し込み期限の確認
    if (now > cancelLimit) return res.status(400).json({ message: `${now} > ${cancelLimit}` });

    // 7. すでに出席登録されていないか確認する
    const [attend] = await db.query("SELECT UserID, isStaff FROM AttendLogs WHERE EventID = ? AND UserID = ?", [eventId, userId]);
    if (attend.length == 0) { // isStaffの場合も出席登録しといてね
        await db.query("INSERT INTO AttendLogs (UserID, EventID, isStaff, Status) VALUES (?, ?, ?, ?)", [userId, eventId, 0, 0]);
        // DB Log
        console.log("Cancel delete from DB:", attend);
        return res.status(200).json({ message: "Cancel registered" });
    } else return res.status(409).json({ message: "CancelLog data conflicted..." });
});

// Edit関連ルートを読み込み
const editRoutes = require('./EventEditRoutes');

// 「/Event/:EventID/EventEdit」配下のルーティングをeditRoutesに委譲
router.use("/:EventID/EventEdit", editRoutes);

module.exports = router;