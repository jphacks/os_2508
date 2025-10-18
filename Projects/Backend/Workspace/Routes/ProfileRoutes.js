// CookieObserverを通すのに必要な処理
const CookieObserver = require('../Tools/CookieObserver');

// ルータを使うのに必要な処理
const { router } = require('express');

// cookieを使うのに必要な処理
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(express.json());

router.get("/", CookieObserver(), (req, res) => {
    // Profile画面を配る
    return res.sendFile(path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html"));
});

router.get("/UserID", CookieObserver(), (req, res) => {
    // Profile画面を配る
    return res.sendFile(path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html"));
});

router.get("/fetch", CookieObserver(), async (req, res) => {
    // トークンの秘密鍵
    const LOGIN_SECRET = process.env.LOGIN_SECRET

    // トークン
    const token = req.cookies?.LoginToken;

    if (!token) return res.status(401).json({ message: "Unauthorized." });
    try {
        // デコードしたトークン
        const decodeToken = jwt.verify(token, LOGIN_SECRET);

        // cookieから取得したユーザーID
        const userId = decodeToken.userId;

        // ユーザーIDで検索したそのユーザーの情報
        const [userInfo] = await db.query("SELECT * FROM Profiles WHERE userId = ?", [userId]);

        if (!userInfo) return res.status(404).json({ message: "Not Found." });
        // ユーザーの情報をjsonの形で返却
        return res.json({
            Name: userInfo[0].Name,
            nickName: userInfo[0].nickName,
            userId: userInfo[0].userId,
            Guraduation: userInfo[0].Guraduation,
            Organization: userInfo[0].Organization,
            isOrganization: userInfo[0].isOrganization,
            Birthday: userInfo[0].Birthday,
            Comment: userInfo[0].Comment
        })
    } catch {
        return res.status(401).json({ message: "Unauthorized." });
    }
});

router.get("/:UserID/Fetch", CookieObserver(), async (req, res) => {
    // クリエパラメーターから取得したユーザーID
    const UserID = req.params.UserID

    // ユーザーIDで検索したそのユーザーの情報
    const [userInfo] = await db.query("SELECT * FROM Profiles WHERE userId = ?", [UserID]);

    if (!userInfo) return res.status(404).json({ message: "Not Found." });
    // ユーザーの情報をjsonの形で返却
    return res.json({
        Name: userInfo[0].Name,
        nickName: userInfo[0].nickName,
        userId: userInfo[0].userId,
        Guraduation: userInfo[0].Guraduation,
        Organization: userInfo[0].Organization,
        isOrganization: userInfo[0].isOrganization,
        Birthday: userInfo[0].Birthday,
        Comment: userInfo[0].Comment
    })
});