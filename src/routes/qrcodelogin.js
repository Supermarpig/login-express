const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const tokenValidator = require('../utils/tokenValidator');
const tokenGenerator = require('../utils/tokenGenerator');
const socketUtil = require('../utils/socket');


let tokenUserMap = {};

function associateTokenWithUser(token, username) {
    // console.log(`Associating token ${token} with username ${username}`);
    tokenUserMap[token] = username;
}

function findUserByToken(token) {
    // console.log(`Finding username for token ${token}`);
    return tokenUserMap[token];
}

router.get('/confirm-login', async (req, res) => {
    const { token } = req.query;
    // 查找與Token關聯的用戶
    const decodedToken = decodeURIComponent(token);
    const username = findUserByToken(decodedToken);
    if (username) {
        const user = { username: username }; // 從某處獲取完整的userInfo
        const io = socketUtil.getIO();
        // console.log(`Emitting 'login-success' for token: ${token}`);
        io.to(token).emit('login-success', { token: tokenGenerator(user.username) });
        // console.log(`Emission complete`);
        console.log({ success: true, message: '身份確認成功' });
        res.json('驗證成功~~~耶');
    } else {
        res.status(401).json({ success: false, message: '身份確認失敗' });
    }
});

router.get('/generate-qr', async (req, res) => {
    const loginAttemptToken = tokenGenerator('QRLoginAttempt');
    // const loginUrl = `${req.protocol}://${req.get('host')}/qr-confirm-login?token=${loginAttemptToken}`;

    const username = "user1";
    associateTokenWithUser(loginAttemptToken, username);
    const encodedToken = encodeURIComponent(loginAttemptToken);
    const loginUrl = `${req.protocol}://192.168.0.191:3000/qrCodeLogin/confirm-login?token=${encodedToken}`;

    try {
        const qrCodeImage = await QRCode.toDataURL(loginUrl);
        res.json({ success: true, qrCode: qrCodeImage, token: loginAttemptToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '生成QR Code失敗' });
    }
});

module.exports = router;
