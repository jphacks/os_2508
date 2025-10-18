const invitedKey = req.body.invitedKey    // ユーザーが入力した招待コード
const INVITED_KEY = process.env.INVITED_KEY    // 招待コード

// 違う階層から.envを読み込む処理
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

if (invitedKey == INVITED_KEY) {
    const status = { status: "success" };

    const AUTH_SECRET = process.env.AUTH_SECRET    //.env内のトークンの秘密鍵
    const AUTH_REFRESH_SECRET = process.env.AUTH_REFRESH_SECRET    //.env内のリフレッシュトークンの秘密鍵

    const token = jwt.sign(status, AUTH_SECRET, { expiresIn: '1h' });    // トークンの準備
    const refreshToken = jwt.sign(status, AUTH_REFRESH_SECRET, { expiresIn: '7d' });    // リフレッシュトークンの準備

    //cookie返却
    res.cookie('InvitedToken', token, { httpOnly: false, sameSite: 'strict', expiresIn: '1h' });
    res.cookie('InvitedRefreshToken', refreshToken, { httpOnly: true, expiresIn: '90d' });

    return res.redirect("/Home")
} else return res.status(401).json({ message: "Unauthorized." });