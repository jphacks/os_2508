const cookieObserver = require('../Tools/CookieObserver');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const router = express.Router({mergeParams: true});
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { db } = require("../Tools/db");

// cookieを使う
router.use(cookieParser());

// .envを違う階層から読み込む。
dotenv.config({ path: path.join(__dirname, "..", ".env")});
async function CheckStaff(req, eventId) {
    if (!eventId) throw new Error("eventId is required"); 
    let result;

    // 1. cookieを取得する
    const token = req.cookies.LoginToken;
    console.log("[CheckStaff] token:", token); // デバッグ
    if (!token) throw new Error("Unauthorized");

    // 2. Tokenのdecodeと情報の読み出し
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.LOGIN_SECRET);
        console.log("[CheckStaff] decodedToken:", decodedToken); // デバッグ
    } catch (err) {
        console.error("[CheckStaff] JWT decode error:", err);
        throw new Error("InvalidToken");
    }

    const userId = decodedToken.userId;
    console.log("[CheckStaff] userId:", userId, "eventId:", eventId); // デバッグ

    // 3. DBからisStaffを取り出し
    const [rows] = await db.query(
        "SELECT isStaff FROM AttendLogs WHERE UserID = ? AND EventID = ?;",
        [userId, eventId]
    );
    console.log("[CheckStaff] DB rows:", rows); // デバッグ

    if (rows.length === 0) result = 0;
    else result = rows[0].isStaff;

    console.log("[CheckStaff] result (isStaff):", result); // デバッグ
    return result;
}

// isStaffのチェック
router.get("/", cookieObserver(), async (req, res) => {
    const eventID = req.params.EventID;
    console.log("EventEditRoutes accessed", eventID);
    try {
        // 1. isStaffの確認
        const isStaff = await CheckStaff(req, eventID);
        console.log("isStaff:", isStaff);
        if(isStaff != 1){
            return res.status(403).json({message: "Access denied. Organizer only."});
        }

        // 2. ページの配布
        return res.sendFile(path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html"));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load edit page" });
    }
});

router.get("/:EventID/Fetch", cookieObserver(), async (req, res) => {
    const eventID = req.params.EventID;
    // 1. isStaffの確認
    const isStaff = await CheckStaff(req, eventID);
    if(isStaff != 1){
            return res.status(403).json({message: "Access denied. Organizer only."});
    }

    // 2. イベント情報を取得
    const [rows] = await db.query("SELECT * FROM Events WHERE EventID = ?;", [eventID]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "Event not found." });
    }

    return res.json({ EventData: rows[0] });

});

// イベント更新
router.post("/:EventID/EventEdit", cookieObserver(), async (req, res) => {
    const eventID = req.params.EventID;
    try {
        const EventID = req.params.EventID;
        const isStaff = await CheckStaff(req, EventID);
        if (isStaff != 1) {
            return res.status(403).json({ message: "Access denied. Organizer only." });
        }

        const { newData } = req.body;

        // EventIDを変更させない
        if ("EventID" in newData) delete newData.EventID;

        const fields = Object.keys(newData)
            .map(key => `${key} = ?`)
            .join(", ");
        const values = Object.values(newData);

        if (fields.length === 0) {
            return res.status(400).json({ message: "No update fields provided." });
        }

        // ✅ req.params の EventID を使用
        await db.query(`UPDATE Events SET ${fields} WHERE EventID = ?`, [...values, EventID]);

        console.log(`[UPDATE SUCCESS] EventID=${EventID}`);
        res.json({ message: "Event updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update event" });
    }
});


//イベントの削除
router.delete("/:EventID/DeleteEvent", cookieObserver(), async (req, res) => {
    const eventID = req.params.EventID;
    try {
        const isOrganizer = await CheckOrganizer(req);
        if (isOrganizer != 1) {
            return res.status(403).json({ message: "Access denied. Organizer only." });
        }

        const eventID = req.params.EventID;

        // EventIDの存在確認
        const [rows] = await db.query("SELECT * FROM Events WHERE EventID = ?;", [eventID]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Event not found." });
        }

        // 削除処理
        await db.query("DELETE FROM Events WHERE EventID = ?;", [eventID]);
        res.json({ message: "Event deleted successfully." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete event" });
    }
});

module.exports = router;
