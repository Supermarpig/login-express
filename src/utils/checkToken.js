const validateToken = require('./tokenValidator'); // 引入您已有的token驗證函數

function checkToken(req, res, next) {
    const token = req.cookies.token || req.query.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.redirect('/login'); // 如果沒有token，則重定嚮到登入頁
    }
    if (validateToken(token)) {
        next(); // 如果token有效，則繼續處理請求
    } else {
        res.redirect('/login'); // 如果token無效，則重定嚮到登入頁麵
    }
}

module.exports = checkToken;
