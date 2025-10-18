const jwt = require("jsonwebtoken");
const db = require("./db");

const statusQueries = {
    isOrganizer: {
        query: "SELECT isOrganizer AS result FROM Profiles WHERE UserID = ?",
        params: (userId, payload) => [userId]
    },
    isStaff: {
        query: "SELECT isStaff AS result FROM AttendLogs WHERE UserID = ? AND EventID = ?",
        params: (userId, payload) => [userId, payload]  // payload に EventID を渡す
    }
};

async function CheckStatus(token, status, payload = null){
    // 0. Startup Log
    console.log("CS is running!");

    let result = 0;
    // tokenがなかった瞬間statusは0になる
    if (!token){
        return result;
    }

    // tokenがあった場合、改ざんの形跡がないか検証
    try{
        // tokenの改ざんがないか検証 + UserIDの読み出し
        let decodedToken;
        decodedToken = jwt.verify(token, process.env.LOGIN_SECRET);
        const userId = decodedToken.userId;
        // VerifySuccessLog
        console.log("LoginToken is verified!");

        // 問題ないのでDB検索を行う
        const statusInfo = statusQueries[status];
        if (!statusInfo) {
            console.error("指定されたStatusが存在しません:", status);
            return result;
        }
        // DB検索
        const [rows] = await db.query(statusInfo.query, statusInfo.params(userId, payload));
        if (rows.length !== 0) result = rows[0].result;

        // 結果を返す
        return result;
    }catch(err){
        // VerifyErrorLog
        console.error("LoginToken is not verified!", err);
        // 検証に問題があった瞬間Authへ飛ばす
        return result;
    }
}

module.exports = CheckStatus;