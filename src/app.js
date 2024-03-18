const express = require('express');
const passportSetup = require('./config/passport-setup');
const path = require('path');
const login = require('./routes/login');
const logout = require('./routes/logout');

const app = express();

// 設置中間件來解析請求體
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 初始化Passport
app.use(passportSetup.initialize());

// 靜態文件服務
app.use(express.static('public'));
// app.use('/', express.static(path.join(__dirname, '../auth')));

// 路由
app.use('/', login);
app.use('/', logout);

// 定義首頁路由
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, './auth/login.html'));
});

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
