const express = require('express');
const path = require('path');
const dotenv = require("dotenv");
//const { db } = require("../Tools/DB");
//const CookieObserver = require('../Tools/CookieObservre');

const router = express.Router();
dotenv.config({ path: path.join(__dirname, "..", ".env")});
router.get('/', CookieObserver(), (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "..", "..", "Frontend", "react-files", "dist", "index.html"));
});

router.port('/Submit', CookieObserver(), async(req, res) =>{
    try{
        const {
            nickname, birth, userId, password, gradYear, organization, comment
        } = req.body;

        if(!nickname || !birth || !userId || !password || !gradYear || !organization || !comment){
            return res.status(400).json({message: "必要な情報が不足しています"}); 
        }

        const [exist] = await db.query(
            "SELECT * FROM Identify WHERE UserID = ?", [userId]
        );

        if(exist.length > 0){
            return res.status(409).json({message: "このユーザーIDはすでに使われています"})
        }

        const pepper = process.env.PEPPER;
        if(!pepper) {
            return res.status(500).json({message: "サーバー設定エラー"});
        }
        const hashedPassword = await argon2.hash(passwordWithPepper, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,   // 推奨: 64MB
            timeCost: 5,           // 計算回数
            parallelism: 1         // 並列数
        });

        await db.query(
            "INSERT INTO Idetntify (UserID, Password) VALUES (?, ?)",
            [userId, hashedPassword]
        );


        const birthday = birth.replace(/\//g, '-');
        const isorganizer = null;
        await db.query(
            "INSERT INTO Profiles (UserID, Nickname, Graduation, Organization, isOrganizer, Birthday, Comment) VALUES(?,?,?,?,?,?,?)"
            [userId, nickname, gradYear, organization, isorganizer, birthday, comment]
        );

         // 9. 登録成功 → Homeへリダイレクト
        res.status(200).json({ redirect: "/Home" });
        } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
        }
    });

module.exports = router;