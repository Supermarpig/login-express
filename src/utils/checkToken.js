const validateToken = require('./tokenValidator'); // 引入您已有的token驗證函數

function checkToken(req, res, next) {
    const token = req.cookies.token || req.query.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.redirect('/login'); // 如果没有token，则重定向到登录页面
    }
    if (validateToken(token)) {
        next(); // 如果token有效，则继续处理请求
    } else {
        res.redirect('/login'); // 如果token无效，则重定向到登录页面
    }
}

module.exports = checkToken;
