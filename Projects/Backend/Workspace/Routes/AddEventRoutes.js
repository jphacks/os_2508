const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { db } = require("../Tools/db");
const CheckStatus = require('../Tools/CheckStatus');
const path = require('path');

// cookieを使う
router.use(cookieParser());

// イベント作成ページ表示
router.get("/", async (req, res) => {
    // 0. Startup Log
    console.log("/Event/AddEvent-API is running!");

    // 1. Cookieから情報を取得
    const token = req.cookies?.LoginToken;

    // 2. tokenがあった場合、改ざんの形跡がないか検証
    try {
        // tokenの改ざんがないか検証
        jwt.verify(token, process.env.LOGIN_SECRET);
        // Verify Success Log
        console.log("LoginToken is verified!");

        // isOrganizerの確認
        if (await CheckStatus(token, "isOrganizer") == 0) {
            console.log("isOrganizer:", isOrganizer);
            return res.status(401).json({ message: "Unauthorized." });
        };

        // 画面遷移
        return res.sendFile(path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html"));
    } catch (err) {
        // Verify Error Log
        console.error("LoginToken is not verified!", err);
        // 検証に問題があった瞬間エラー
        return res.status(401).json({ message: "Unauthorized." });
    }
});

// 新規イベント登録
router.post("/Update", async (req, res) => {
    // 0. Startup Log
    console.log("/Event/AddEvent-API is running!");

    // 1. Cookieから情報を取得
    const token = req.cookies?.LoginToken;

    // 2. tokenがあった場合、改ざんの形跡がないか検証
    try {
        // tokenの改ざんがないか検証
        jwt.verify(token, process.env.LOGIN_SECRET);
        // Verify Success Log
        console.log("LoginToken is verified!");

        // isOrganizerの確認
        if (await CheckStatus(token, "isOrganizer") == 0) {
            console.log("isOrganizer:", isOrganizer);
            return res.status(401).json({ message: "Unauthorized." });
        };

        // フロントエンドから送られてきた情報を取得 (EventIDを追加)
        const { EventID, EventName, StartDateTime, EndDateTime, EntryFee, EventDescription } = req.body;

        // 必須項目が入力されているか確認 (EventIDを追加)
        if (!EventID || !EventName || !StartDateTime || !EndDateTime) {
            return res.status(400).json({ message: "イベントID、イベント名、開始日時、終了日時は必須項目です。" });
        }

        // EventIDが既に存在していないか検証
        const [existingEvents] = await db.query("SELECT 1 FROM Events WHERE EventID = ? LIMIT 1;", [EventID]);
        if (existingEvents.length > 0) {
            return res.status(409).json({ message: "そのイベントIDは既に使用されています。" }); // 409 Conflict
        }

        // データベースにイベント情報を追加
        await db.query(
            `INSERT INTO Events (EventID, EventName, StartDateTime, EndDateTime, EntryFee, EventDescription) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [EventID, EventName, StartDateTime, EndDateTime, EntryFee, EventDescription]
        );

        // イベント作成者を運営スタッフとしてAttendテーブルに登録
        await db.query(
            `INSERT INTO Attend (UserID, EventID, isStaff, Status) VALUES (?, ?, ?, ?)`,
            [userId, EventID, 1, 0]
        );

        // 登録成功のレスポンスを返す
        console.log("新規イベントの作成が完了しました。");
        return res.status(201).json({ message: "新規イベントの作成が完了しました" });
    } catch (err) {
        // Verify Error Log
        console.error("LoginToken is not verified!", err);
        // 検証に問題があった瞬間エラー
        return res.status(401).json({ message: "Unauthorized." });
    }
});

module.exports = router;

// カラムの編集
// isStaffの登録