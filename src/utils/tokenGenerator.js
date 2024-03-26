
const crypto = require('crypto')
const secretKey = 'IamKey'

const tokenGenerator = (text) => {

    // 設定token的過期時間為當前時間加上60秒（一分鍾後過期）
    const exp = Math.floor(Date.now() / 1000) + 60; // 使用Unix時間戳，單位是秒

    const payload = {
        txt: text,
        iat: Date.now(),
        exp: exp  // 過期時間
    }
    
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64')

    const hmac = crypto.createHmac('sha256', secretKey)

    const result = hmac.update(payloadBase64).digest('base64')

    return `${payloadBase64}.${result}`
}


// console.log('tokenGenerator.js', tokenGenerator('john'))

module.exports = tokenGenerator