const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const path = require('path');
const login = require('./routes/login');
const logout = require('./routes/logout');
const qrCodeLoginRoute = require('./routes/qrCodeLogin');

const socketUtil = require('./utils/socket');

// 驗證token
const validateToken = require('./utils/tokenValidator');
const checkToken = require('./utils/checkToken');

const app = express();
const server = http.createServer(app)

// 初始化socket.io並將http服務器實例傳給它
socketUtil.init(server);

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

app.get('/page1',function (req, res) {
    res.sendFile(path.join(__dirname, './views/page1.html'));
});
app.get('/page2',function (req, res) {
    res.sendFile(path.join(__dirname, './views/page2.html'));
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


app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.resolve('./node_modules/socket.io/client-dist/socket.io.js'));
  });

// 啟動伺服器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});