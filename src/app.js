const express = require('express');
const passportSetup = require('./config/passport-setup');
const path = require('path');
const login = require('./routes/login');
const logout = require('./routes/logout');
const qrCodeLoginRoute = require('./routes/qrcodelogin');

// 驗證token
const validateToken = require('./utils/tokenValidator');

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
app.use('/qrCodeLogin', qrCodeLoginRoute);

// 定義首頁路由
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, './views/login.html'));
});

app.get('/entry', (req, res) => {
    const { token } = req.query;
    if (validateToken(token)) {
        // Token驗證成功
        res.cookie('token', token, { httpOnly: true });
        res.json({ success: true, message: 'Token驗證成功' });
        res.redirect('/');
    } else {
        // Token驗證失敗
        res.redirect('/login');
        res.json({ success: false, message: 'Token驗證失敗' });
    }
});


// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});