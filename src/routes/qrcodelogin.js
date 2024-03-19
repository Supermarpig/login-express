const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const tokenValidator = require('../utils/tokenValidator'); // 假設validateToken函數保存在同一目錄下的validateToken.js文件中
const tokenGenerator = require('../utils/tokenGenerator'); // 引入之前提供的token生成器

router.get('/qr-login', (req, res) => {
    const { token } = req.query;

    // 使用validateToken函數檢查token的有效性
    if (tokenValidator(token)) {
        try {
            // 解析token並檢查是否過期，此處需要實現getUsernameByToken函數
            const username = getUsernameByToken(token);
            // 生成新的session或token給用戶，這裡重新使用tokenGenerator函數生成token
            const userToken = tokenGenerator(username);
            // 重定向到用戶入口頁面並帶上新的token
            res.redirect(`/entry?token=${userToken}`);
        } catch (error) {
            // 處理錯誤，例如token過期
            res.status(401).json({ success: false, message: error.message });
        }
    } else {
        // 如果token無效
        res.status(401).json({ success: false, message: '無效的Token。' });
    }
});

// 生成登錄QR Code的路由
router.get('/generate-qr', async (req, res) => {
    const loginToken = tokenGenerator("QRLogin");
    const loginUrl = `${req.protocol}://${req.get('host')}/qr-login?token=${loginToken}`;

    try {
        const qrCodeImage = await QRCode.toDataURL(loginUrl);
        // 修改這裡，發送JSON對象而不是HTML
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