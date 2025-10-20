// CookieObserverとisStaffを通すのに必要な処理
const CookieObserver = require('../Tools/CookieObserver');
const CheckStatus = require('../Tools/CheckStatus');

const express = require('express');
const router = express.Router({ mergeParams: true });
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
router.get("/", CookieObserver(), async (req, res) => {
    // 0. Startup Log
    console.log("/Event/:EventID/ManagementEvent-API is running!");

    // 1. EventIDを取得
    const EventID = req.params.EventID;

    // 2. Cookieから情報を取得
    const token = req.cookies?.LoginToken;

    // 3. tokenがあった場合、改ざんの形跡がないか検証
    try {
        // tokenの改ざんがないか検証
        jwt.verify(token, process.env.LOGIN_SECRET);
        // Verify Success Log
        console.log("LoginToken is verified!");

        // isStaffの取得
        const isStaff = await CheckStatus(token, "isStaff", EventID);
        //ユーザーがスタッフである場合の処理
        if (isStaff === 1) return res.sendFile(path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html"));
        else return res.status(403).json({ error: 'You are not staff.' });
    }catch(err){
        // Verify Error Log
        console.error("LoginToken is not verified!", err);
        // 検証に問題があった瞬間エラー
        return res.status(401).json({ message: "Unauthorized." });
    }
});

/*==========API Manual==========
# Input
PathParameter, Cookies

# Output
Json
{
  "Attend": [
    { "UserID": "<UserID>(string)", "EventID": "<EventID>(string)", "Status": 0 or 1, "Nickname": "<Nickname>(string)", "Graduation": <Graduation>(int), "Organization": "<Organization>(string)" },
    { "UserID": "<UserID>(string)", "EventID": "<EventID>(string)", "Status": 0 or 1, "Nickname": "<Nickname>(string)", "Graduation": <Graduation>(int), "Organization": "<Organization>(string)" }
  ],
  "Schedules": [
    { "ScheduleID": <ScheduleID>(int), "EventID": "<EventID>(string)", "Time": "<Time>(10:00形式のstring)", "Status": 0 or 1 },
    { "ScheduleID": <ScheduleID>(int), "EventID": "<EventID>(string)", "Time": "<Time>(10:00形式のstring)", "Status": 0 or 1 }
  ]
}

==========API Manual==========*/
router.get("/Fetch", CookieObserver(), async (req, res) => {
    // 0. Startup Log
    console.log("/Event/:EventID/ManagementEvent/Fetch-API is running!");

    // 1. EventIDを取得
    const EventID = req.params.EventID;

    // 2. Cookieから情報を取得
    const token = req.cookies?.LoginToken;

    // 3. tokenがあった場合、改ざんの形跡がないか検証
    try {
        // tokenの改ざんがないか検証
        jwt.verify(token, process.env.LOGIN_SECRET);
        // Verify Success Log
        console.log("LoginToken is verified!");

        // isStaffの取得
        const isStaff = await CheckStatus(token, "isStaff", EventID);
        console.log("[/Event/:EventID/ManagementEvent/Fetch-API] isStaff is ", isStaff);
        //ユーザーがスタッフである場合の処理
        if (isStaff === 1) {
            const [Attend] = await db.query("SELECT AttendLogs.*, Profiles.Nickname, Profiles.Graduation, Profiles.Organization FROM AttendLogs JOIN Profiles ON AttendLogs.UserID = Profiles.UserID WHERE AttendLogs.EventID = ?", [EventID]);
            // DB Log
            console.log("Attend fetched from DB:", Attend);
            const [Schedules] = await db.query("SELECT * FROM Schedules WHERE EventID = ?", [EventID]);
            // DB Log
            console.log("Schedules fetched from DB:", Schedules);
            return res.json({ Attend, Schedules });
        }
        else return res.status(403).json({ error: 'You are not staff.' });
    }catch(err){
        // Verify Error Log
        console.error("LoginToken is not verified!", err);
        // 検証に問題があった瞬間エラー
        return res.status(401).json({ message: "Unauthorized." });
    }
});

/*==========API Manual(/UpdateAttendLogs)==========
# Input
JSON
{
    { UserID :"<UserID(string)>", EventID: "<EventID(string)>", Status: "<Status(0 or 1)>"},
    { UserID :"<UserID(string)>", EventID: "<EventID(string)>", Status: "<Status(0 or 1)>"},
    { UserID :"<UserID(string)>", EventID: "<EventID(string)>", Status: "<Status(0 or 1)>"}
}

# Output
Json
{
    { message: "<message>" }
}
==========API Manual==========*/
router.post("/UpdateAttendLogs", CookieObserver(), async (req, res) => {
    // 0. Startup Log
    console.log("/Event/:EventID/ManagementEvent/UpdateAttendLogs-API is running!");

    // 1. EventIDを取得
    const EventID = req.params.EventID;

    // 2. Cookieから情報を取得
    const token = req.cookies?.LoginToken;

    // 3. tokenがあった場合、改ざんの形跡がないか検証
    try {
        // tokenの改ざんがないか検証
        jwt.verify(token, process.env.LOGIN_SECRET);
        // Verify Success Log
        console.log("LoginToken is verified!");

        // isStaffの取得
        const isStaff = await CheckStatus(token, "isStaff", EventID);
        //ユーザーがスタッフである場合の処理
        if (isStaff === 1) {
            const attendLogs = req.body;
            if (!Array.isArray(attendLogs)) return res.status(400).json({ message: "Array expected" });

            for (const attendLog of attendLogs) {
                const { UserID, EventID, Status } = attendLog;
                if (!UserID || !EventID || Status === undefined || Status === null) return res.status(400).json({ message: "Bad Request: 入力項目が足りません。" });;

                await db.query(
                    "UPDATE AttendLogs SET Status = ? WHERE UserID = ? AND EventID = ?;",
                    [attendLog.Status, UserID, EventID]
                );
            }

            return res.status(200).json({ message: "OK: Events inserted" });
        }
        else return res.status(403).json({ message: "Forbidden: You are not staff." });
    }catch(err){
        // Verify Error Log
        console.error("LoginToken is not verified!", err);
        // 検証に問題があった瞬間エラー
        return res.status(401).json({ message: "Unauthorized." });
    }
});

module.exports = router;
