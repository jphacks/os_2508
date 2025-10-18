const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const CookieObserver = require('../Tools/CookieObserver');
const CheckStatus = require('../Tools/CheckStatus');

//use系
router.use(cookieParser());

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
        // VerifySuccessLog
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
        // VerifyErrorLog
        console.error("LoginToken is not verified!", err);
        // 検証に問題があった瞬間エラー
        return res.status(401).json({message: "Unauthorized."});
    }
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
        // VerifySuccessLog
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
        // VerifyErrorLog
        console.error("LoginToken is not verified!", err);
        // 検証に問題があった瞬間エラー
        return res.status(401).json({message: "Unauthorized."});
    }
});