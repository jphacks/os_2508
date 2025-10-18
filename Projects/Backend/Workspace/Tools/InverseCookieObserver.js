function InverseCookieObserver() {
    return (req, res, next) => {
        // 0. Startup Log
        console.log("ICO is running!");

        // 1. Cookieから情報を取得
        const token = req.cookies?.InvitedToken;
        // tokenがなかった瞬間Authへ飛ばす
        if (!token){
            return res.redirect("/");
        }

        // 2. tokenがあった場合、改ざんの形跡がないか検証
        try{
            // tokenの改ざんがないか検証
            jwt.verify(token, process.env.AUTH_SECRET);
            // VerifySuccessLog
            console.log("InvitedToken is verified!");
            // 問題ない場合はHomeへ
            return res.redirect("/Home");
        }catch(err){
            // VerifyErrorLog
            console.error("InvitedToken is not verified!", err);
            // 検証に問題があったなら画面を継続
            next();
        }
    }
}

module.exports = InverseCookieObserver;