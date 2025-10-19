const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const CookieObserver = require('../Tools/InverseCookieObserver');
const path = require('path');
const dotenv = require('dotenv');
const { db } = require('../Tools/db');

router.use(cookieParser());
router.use(express.json());
dotenv.config({ path: path.join(__dirname, "..", ".env") });

router.get("/", CookieObserver(), async (req, res) => {
    try {
        const keyword = req.query.keyword;
        if (!keyword || keyword.trim() === "") {
            return res.status(400).json({ message: "Keyword is required." });
        }

        const like = `%${keyword}%`;

        // 部分一致検索：EventName や Introduction, Sponsor など対象カラムを自由に追加可
        const query = `
            SELECT * FROM Events 
            WHERE 
                EventName LIKE ? OR 
                Introduction LIKE ? OR
                Sponsor LIKE ? OR
                Place LIKE ? OR
                Method LIKE ?
        `;

        const [eventInfo] = await db.query(query, [like, like, like, like, like]);

        if (!eventInfo || eventInfo.length === 0) {
            return res.status(404).json({ message: "No events found." });
        }

        // 部分一致なので複数ヒットする → 配列で返す
        return res.json({
            count: eventInfo.length,
            eventData: eventInfo
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error." });
    }
});

