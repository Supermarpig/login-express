const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const tokenValidator = require('../utils/tokenValidator'); // 假設validateToken函數保存在同一目錄下的validateToken.js文件中
const tokenGenerator = require('../utils/tokenGenerator'); // 引入之前提供的token生成器

router.get('/qr-login', (req, res) => {
    const { token } = req.query;
    const validationResult = validateToken(token); // 使用validateToken函數檢查令牌

    if (validationResult.valid) {
        try {
            const username = getUsernameByToken(token); // 解析令牌獲取用戶名
            const userToken = tokenGenerator(username); // 為用戶生成新的令牌
            res.redirect(`/entry?token=${userToken}`); // 假設`/entry`是用戶登入後的頁麵
        } catch (error) {
            res.status(401).json({ success: false, message: error.message });
        }
    } else {
        res.status(401).json({ success: false, message: validationResult.reason });
    }
});

// 生成登錄QR Code的路由
router.get('/generate-qr', async (req, res) => {
    const loginToken = tokenGenerator("user1"); // 假設"用戶1"是登入用戶的標識
    const loginUrl = `${req.protocol}://${req.get('host')}/qr-login?token=${loginToken}`;

    try {
        const qrCodeImage = await QRCode.toDataURL(loginUrl);
        res.json({ success: true, qrCode: qrCodeImage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '生成QR Code失敗' });
    }
});

// 這裡需要實現getUsernameByToken函數，解析token並檢查過期時間
function getUsernameByToken(token) {
    const [payloadBase64] = token.split('.');
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    
    // 檢查token是否過期
    if (payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token已過期');
    }

    return payload.txt;
}

module.exports = router;