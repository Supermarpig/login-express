// /routes/qrcodelogin.js
const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const crypto = require('crypto');

const secretKey = "IamKey124"; // 用於生成哈希的密鑰
const tokens = {}; // 存儲生成的token和時間戳

// 生成哈希函數
function generateToken() {
    const now = Date.now().toString();
    const hash = crypto.createHmac('sha256', secretKey).update(now).digest('hex');
    return hash;
}

// 生成免洗QR碼的路由
router.get('/generate-qr', async (req, res) => {
    const token = generateToken();
    tokens[token] = Date.now(); // 存儲token和當前時間戳

    try {
        const qrCodeDataURL = await QRCode.toDataURL(token);
        res.send({ success: true, qrCode: qrCodeDataURL, token: token });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Failed to generate QR code.' });
    }
});

// 驗證QR碼和密碼的路由
router.post('/verify-qr', (req, res) => {
    const { token, password } = req.body;

    if (tokens[token] && Date.now() - tokens[token] < 5 * 60 * 1000) { // 檢查token是否存在且未過期（5分鍾有效）
        if (password === "password123") { // 假設的密碼驗證
            delete tokens[token]; // 驗證成功後刪除token
            res.send({ success: true, message: 'Logged in successfully.' });
        } else {
            res.status(401).send({ success: false, message: 'Invalid password.' });
        }
    } else {
        res.status(400).send({ success: false, message: 'Invalid or expired QR code.' });
    }
});

module.exports = router;
