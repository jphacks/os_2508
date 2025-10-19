const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { db } = require("../Tools/db");

// cookieを使う
router.use(cookieParser());

// isOrganizerのチェック
async function CheckOrganizer(req, res) {
    try {
        // 1. cookieからトークンを取得
        const token = req.cookies.jwtToken;
        if (!token) {
            res.status(401).json({ message: "No token provided." });
            return null;
        }

        // 2. JWTを検証・デコードしてuserIdを取得
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        // 3. DBから該当ユーザーのisOrganizerを取得
        const [rows] = await db.query(
            "SELECT isOrganizer FROM Profiles WHERE UserID = ?;",
            [userId]
        );

        // 4. ユーザーが存在しない場合
        if (rows.length === 0) {
            res.status(404).json({ message: "User not found." });
            return null;
        }

        // 5. 運営者でない場合
        if (rows[0].isOrganizer !== 1) {
            res.status(403).json({message: "Access denied. Organizer only."});
            return null;
        }
    
        // 6. userIdを返す
        return userId;
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to verify organizer status." });
        return null;
    }
}

// イベント作成ページ表示
router.get("/", async (req, res) => {
    // 0. Startup Log
    console.log("/Event/AddEvent-API is running!");

    // 1. CheckOrganizer
    const userId = await CheckOrganizer(req, res);
    if(!userId){
        return res.status(401).json({message: "You are not Organizer."});
    }
    
    // 1. 画面遷移
    return res.sendFile(path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html"));
});

// 新規イベント登録
router.post("/Update", async (req, res) => {
    try {
        // 0. Startup Log
        console.log("/Event/AddEvent/Update-API is running!");

        // 1. CheckOrganizer
        const userId = await CheckOrganizer(req, res);
        if (!userId) {
            return res.status(401).json({message: "You are not Organizer."});
        }

        // 2. フロントエンドから送られてきた情報を取得 (EventIDを追加)
        const { EventID, EventName, StartDateTime, EndDateTime, EntryFee, EventDescription } = req.body;

        // 3. 必須項目が入力されているか確認 (EventIDを追加)
        if (!EventID || !EventName || !StartDateTime || !EndDateTime) {
            return res.status(400).json({ message: "イベントID、イベント名、開始日時、終了日時は必須項目です。" });
        }

        // 4. EventIDが既に存在していないか検証
        const [existingEvents] = await db.query("SELECT 1 FROM Events WHERE EventID = ? LIMIT 1;", [EventID]);
        if (existingEvents.length > 0) {
            return res.status(409).json({ message: "そのイベントIDは既に使用されています。" }); // 409 Conflict
        }

        // 5. データベースにイベント情報を追加
        await db.query(
            `INSERT INTO Events (EventID, EventName, StartDateTime, EndDateTime, EntryFee, EventDescription) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [EventID, EventName, StartDateTime, EndDateTime, EntryFee, EventDescription]
        );

        // 6. イベント作成者を運営スタッフとしてAttendテーブルに登録
        await db.query(
            `INSERT INTO Attend (UserID, EventID, isStaff, Status) VALUES (?, ?, ?, ?)`,
            [userId, EventID, 1, 0]
        );

        // 7. 登録成功のレスポンスを返す
        console.log("新規イベントの作成が完了しました。");
        return res.status(201).json({message: "新規イベントの作成が完了しました"});

    } catch (error) {
        console.error("イベント作成処理中にエラーが発生しました:", error);
        return res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

module.exports = router;

// カラムの編集
// isStaffの登録