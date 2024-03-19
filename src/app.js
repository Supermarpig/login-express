const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const login = require('./routes/login');
const logout = require('./routes/logout');
const qrCodeLoginRoute = require('./routes/qrCodeLogin');

// 驗證token
const validateToken = require('./utils/tokenValidator');
const checkToken = require('./utils/checkToken');

const app = express();
app.use(cookieParser());
// 設置中間件來解析請求體
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 靜態文件服務
app.get('/', checkToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 路由 - 不需要token驗證的路由先註冊
app.use('/', login);
app.use('/login', function (req, res) {
    res.sendFile(path.join(__dirname, './views/login.html'));
});
app.use('/qrCodeLogin', qrCodeLoginRoute);

// 應用token驗證中間件 - 之後的所有路由都需要通過token驗證
app.use(checkToken);

// 需要token驗證的路由
app.use('/', logout);
app.get('/home',function (req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/entry', (req, res) => {
    const { token } = req.query;
    if (validateToken(token)) {
        // Token驗證成功
        res.cookie('token', token, { httpOnly: true });
        res.json({ success: true, message: 'Token驗證成功' });
    } else {
        // Token驗證失敗
        res.json({ success: false, message: 'Token驗證失敗' });
    }
});


// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});