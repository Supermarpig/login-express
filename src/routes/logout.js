const express = require('express');
const router = express.Router();

const sessions = {};

router.get('/logout', (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies.sessionId;

    if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId];
    }

    res.setHeader('Set-Cookie', [
        'token=; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        // 'sessionId=; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    ]);

    res.json({ success: true, message: '您已成功登出。' });
});

// 手動解析cookies
function parseCookies(cookieString) {
    const cookies = {};
    if (cookieString) {
        cookieString.split(';').forEach(cookie => {
            const parts = cookie.match(/(.*?)=(.*)$/);
            if (parts) {
                cookies[parts[1].trim()] = (parts[2] || '').trim();
            }
        });
    }
    return cookies;
}
module.exports = router;
