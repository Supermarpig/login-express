const crypto = require('crypto');
const secretKey = 'IamKey';

// Token驗證函數，加入了過期時間檢查
const validateToken = (token) => {
    // 拆分token為payload和簽名部分
    const parts = token.split('.');
    if (parts.length !== 2) {
        return { valid: false, reason: "Invalid token format." }; // 不合法的token格式
    }

    const payloadBase64 = parts[0];
    const signature = parts[1];
    const hmac = crypto.createHmac('sha256', secretKey);
    
    // 使用載荷（payload）重新生成簽名
    const expectedSignature = hmac.update(payloadBase64).digest('base64');

    // 比較原始簽名與期望簽名，如果不相同，則token不合法
    if (signature !== expectedSignature) {
        return { valid: false, reason: "Invalid signature." }; // 簽名不匹配
    }

    // 解碼payload，檢查過期時間
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    const currentTime = Math.floor(Date.now() / 1000); // 獲取當前時間戳（秒）

    // 檢查token是否過期
    if (payload.exp < currentTime) {
        return { valid: false, reason: "Token expired." }; // token已過期
    }

    // 如果所有檢查都通過，則token有效
    return { valid: true, reason: "" };
};

module.exports = validateToken;
