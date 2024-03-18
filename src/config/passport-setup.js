const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: '/auth/google/callback'
},
    function (accessToken, refreshToken, profile, cb) {
        // 在此處理用戶資料。例如，您可以在這裡檢查資料庫中的用戶
        cb(null, profile);
    }
));

module.exports = passport;
