const crypto = require('crypto');
const secretKey = 'Leyan';

// Token驗證函數
const validateToken = (token) => {
    // 拆分token為payload和簽名部分
    const parts = token.split('.');
    if (parts.length !== 2) {
        return false; // 不合法的token格式
    }

    const payloadBase64 = parts[0];
    const signature = parts[1];
    const hmac = crypto.createHmac('sha256', secretKey);
    
    // 使用載荷（payload）重新生成簽名
    const expectedSignature = hmac.update(payloadBase64).digest('base64');

    // 比較原始簽名與期望簽名，如果相同，則token合法
    return signature === expectedSignature;
};

module.exports = validateToken;
