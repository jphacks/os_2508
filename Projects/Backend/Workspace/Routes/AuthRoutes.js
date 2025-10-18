const invitedKey = req.body.invitedKey
const INVITED_KEY = process.env.INVITED_KEY
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

if (invitedKey == INVITED_KEY) {
    const status = { status: "success" };
    const AUTH_SECRET = process.env.AUTH_SECRET
    const AUTH_REFRESH_SECRET = process.env.AUTH_REFRESH_SECRET

    const token = jwt.sign(status, AUTH_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(status, AUTH_REFRESH_SECRET, { expiresIn: '7d' });

    res.cookie('InvitedToken', token, { httpOnly: false, sameSite: 'strict', expiresIn: '1h' });
    res.cookie('InvitedRefreshToken', refreshToken, { httpOnly: true, expiresIn: '90d' });

    return res.redirect("/Home")
} else return res.status(401).json({ message: "Unauthorized." });