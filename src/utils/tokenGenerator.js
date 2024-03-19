
const crypto = require('crypto')
const secretKey = 'Leyan'

const tokenGenerator = (text) => {
    const payload = {
        txt: text,
        iat: Date.now()
    }
    
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64')

    const hmac = crypto.createHmac('sha256', secretKey)

    const result = hmac.update(payloadBase64).digest('base64')

    return `${payloadBase64}.${result}`
}


// console.log('tokenGenerator.js', tokenGenerator('john'))

module.exports = tokenGenerator