const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const tokenGenerator = require('../utils/tokenGenerator');

// 本地登入處理
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsersData();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // 登入成功，可以設置session或cookie等
        // 生成token
        const token = tokenGenerator(username);
        // 重定向到確認token
        res.redirect(`/entry?token=${token}`);
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

module.exports = router;