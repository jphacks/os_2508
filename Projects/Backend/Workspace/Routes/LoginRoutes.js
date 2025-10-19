const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

// .envファイルから環境変数を読み込む
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// cookieを使う
router.use(cookieParser());

router.get("/", cookieObserver(), (req, res) => {
    // フロントエンドのビルド済みファイルを提供
    res.sendFile(path.join(__dirname, "..", "..", "..", "..", "Frontend", "react-files", "dist", "index.html"));
});

// --- 定数 ---
// ユーザーIDごとの基準値
const MAX_ATTEMPTS = 5; // 5回失敗でブロック
const ATTEMPT_WINDOW_MS = 120 * 60 * 1000; // 120分ごとにリセット
const BLOCK_DURATION_MS = 60 * 60 * 1000; // 60分間ブロック

// IPアドレスごとの基準値
const MAX_IP_ATTEMPTS = 10; // 15分以内に10回失敗でブロック
const IP_LOCK_WINDOW_MINUTES = 15; // IPアドレスの試行回数をカウントする時間枠（分）

router.post("/CheckLogin", cookieObserver, async (req, res) => {
    let userId = ""; // catchブロックでも使えるように外で定義
    try {
        const { password } = req.body;
        userId = req.body.userId; // ユーザーIDを取得

        /*
        //★★★実験によりプロキシサーバなどを通しているか確認する必要がある
        //通しているならば、以下の設定で正しいIPアドレスを取得する
        // プロキシを信頼する設定（プロキシが1段の場合）
        // app.set('trust proxy', 1);
        */
        const ipAddress = req.ip; // IPアドレスを取得
        //★★★実験用(IP表示)console.log("Attempt from IP:", ipAddress); 

        // 1. ユーザーIDとパスワードがあるか確認
        if (!userId || !password) {
            return res.status(400).json({ message: "ユーザーIDとパスワードは必須です" });
        }

        // 文字が長すぎないか検証(軽いDos攻撃対策)
        if (userId.length > 256 || password.length > 256) {
            return res.status(400).json({ message: "入力が長すぎます" });
        }

        // Dos攻撃対策
        // 1.5. IPブロックの確認
        // ★★★サーバー側に一日一回不要なデータを削除するジョブを作る
        const [ipAttempts] = await db.query(
            "SELECT COUNT(*) as count FROM LoginIpAttempts WHERE ip_address = ? AND attempt_timestamp > NOW() - INTERVAL ? MINUTE;",
            [ipAddress, IP_LOCK_WINDOW_MINUTES]
        );

        // そのIPアドレスが制限を超えている場合
        if (ipAttempts[0].count >= MAX_IP_ATTEMPTS) {
            return res.status(429).json({ error: '試行回数が多すぎます。しばらくしてから再度お試しください。' });
        }

        // 2. ユーザー情報を取得
        const [userInfo] = await db.query(
            "SELECT p.*, i.Password FROM Profiles p JOIN Identify i ON p.UserID = i.UserID WHERE p.UserID = ?",
            [userId]
        );
        const user = userInfo[0];

        // 3. パスワードハッシュの準備 (タイミング攻撃対策)
        let hashToVerify;
        // パスワードを味付け
        const PassswordwithPepper = password + process.env.PEPPER;

        if (user) {
            // ユーザーが存在する場合
            hashToVerify = user.Password;
        } else {
            // ユーザーが存在しない場合
            // hashしたダミーパスワードを使用
            hashToVerify = process.env.DUMMY_PASSWORD_HASH;
            // ダミーハッシュが設定されていないか
            if (!hashToVerify || !hashToVerify.startsWith('$argon2')) {
                console.error("DUMMY_PASSWORD_HASHが.envファイルに設定されていないか、無効なArgon2ハッシュです。");
                // フォールバックとしてダミーのハッシュ計算を実行し、処理時間を一定に保つ
                await argon2.hash("fallback_dummy_password_for_timing_attack_prevention");
            }
        }

        // 4. パスワード検証を常に実行 (タイミング攻撃対策)
        const isPasswordVerified = await argon2.verify(hashToVerify, PassswordwithPepper);

        // 5. ユーザーIDごとのブロック状態をチェック 
        const [attemptInfo] = await db.query("SELECT * FROM LoginAttempts WHERE userId = ?", [userId]);
        let userAttempt = attemptInfo[0];
        let isCurrentlyBlocked = false;

        // ブロック中かどうか確認
        if (userAttempt && userAttempt.isBlocked) {
            const timeSinceBlocked = Date.now() - new Date(userAttempt.blockedAt).getTime();
            if (timeSinceBlocked < BLOCK_DURATION_MS) {
                isCurrentlyBlocked = true; // アカウントは現在ロックされている
            } else {
                // ブロック期間が終了していれば、カウンターをリセットする準備
                userAttempt.isBlocked = false;
                userAttempt.attemptCount = 0;
            }
        }

        // 6. 検証結果に基づく処理
        // アカウントがロックされておらず、パスワードが「正しく」、ユーザーが「存在する」場合のみ成功
        if (!isCurrentlyBlocked && isPasswordVerified && user) {
            // ログイン成功
            if (userAttempt) {
                await db.query("DELETE FROM LoginAttempts WHERE userId = ?", [userId]);
            }

            // cookieを生成
            const payload = { userId: user.userId };
            const token = jwt.sign(payload, process.env.LOGIN_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign(payload, process.env.LOGIN_REFRESH_SECRET, { expiresIn: '7d' });
            res.cookie('LoginToken', token, { httpOnly: true, sameSite: 'strict', secure: true });
            res.cookie('LoginRefreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: true });

            return res.status(200).json({ message: "ログインに成功しました" });

        } else {
            // ログイン失敗 (ID/PW間違い、ユーザー不在、アカウントロック中の全ての場合)
            // --- 失敗したIPアドレスを記録 ---
            await db.query("INSERT INTO LoginIpAttempts (ip_address) VALUES (?);", [ipAddress]);

            // ユーザーIDごとのログイン処理回数を更新 
            let currentAttempts = 0;
            if (userAttempt && !userAttempt.isBlocked && userAttempt.lastAttemptAt) {
                const timeSinceLastAttempt = Date.now() - new Date(userAttempt.lastAttemptAt).getTime();
                // 一定時間内の試行のみカウント
                if (timeSinceLastAttempt < ATTEMPT_WINDOW_MS) {
                    currentAttempts = userAttempt.attemptCount;
                }
            }
            // 試行回数を一回増やす
            currentAttempts++;

            // 総当たり攻撃対策: アカウントをブロック
            if (currentAttempts >= MAX_ATTEMPTS) {
                // アカウントをブロック
                const blockQuery = "INSERT INTO LoginAttempts (userId, attemptCount, lastAttemptAt, isBlocked, blockedAt) VALUES (?, ?, NOW(), true, NOW()) ON DUPLICATE KEY UPDATE attemptCount = ?, lastAttemptAt = NOW(), isBlocked = true, blockedAt = NOW()";
                await db.query(blockQuery, [userId, currentAttempts, currentAttempts]);
            } else {
                // 試行回数をカウントアップ
                const countUpQuery = "INSERT INTO LoginAttempts (userId, attemptCount, lastAttemptAt, isBlocked, blockedAt) VALUES (?, ?, NOW(), false, NULL) ON DUPLICATE KEY UPDATE attemptCount = ?, lastAttemptAt = NOW(), isBlocked = false, blockedAt = NULL";
                await db.query(countUpQuery, [userId, currentAttempts, currentAttempts]);
            }

            // ユーザーの有無を知られないため失敗理由に関わらず、常に同じエラーメッセージとステータスを返す
            return res.status(401).json({ message: "ユーザーIDまたはパスワードが無効です" });
        }

    } catch (error) {
        // ① サーバーログ（詳細を記録）
        console.error("Login: 予期せぬ内部エラーが発生しました", error);
        // ② クライアントへのレスポンス
        // 攻撃者にヒントを与えないよう、メッセージは曖昧にする
        res.status(500).json({ message: "サーバーエラーが発生しました。時間をおいて再度お試しください。" });
    }
});

module.exports = router;