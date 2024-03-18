const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// JWT
const { createHmac } = require('node:crypto')
const secret = 'IamKey124'
const sessions = {}

// 本地登入處理
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsersData();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // 登入成功，可以設置session或cookie等

        // JWT
        const token = createHash(JSON.stringify({ username, time: Date.now() }));

        // session
        const sessionId = new Date().getTime() + Math.random().toString(36);
        sessions[sessionId] = { username };
        
        // 設置Cookie和Authorization標頭
        res.setHeader('Set-Cookie', [
            `token=${token}; Expires=${getMidnightExpiration()}; HttpOnly`
        ]);
        
        res.setHeader('Authorization', `Bearer ${token}`);
        res.json({ success: true });
    } else {
        // 登入失敗
        res.json({ success: false, message: '帳號或密碼錯誤。' });
    }
});

// 讀取用戶資料
function readUsersData() {
    const usersFilePath = path.join(__dirname, '..', 'users.json');
    const rawData = fs.readFileSync(usersFilePath);
    return JSON.parse(rawData);
}

function createHash(password) {
    return createHmac('sha256', secret).update(password).digest('hex');
}

function readUsersData() {
    const usersFilePath = path.join(__dirname, '..', 'users.json');
    const rawData = fs.readFileSync(usersFilePath);
    return JSON.parse(rawData);
}

// 抓到每天凌晨12點時間
function getMidnightExpiration() {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return midnight.toUTCString();
}
module.exports = router;