const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const facebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");

const configKey = require("../../config/config-key");
const { User } = require("../../models/user.model");
const { Admin } = require("../../models/admin.model");

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: configKey.SECRET_KEY,
    ignoreExpiration: true
};

const strategyJWT = new JwtStrategy(opts, (payload, done) => {
    switch (payload.userType) {
        case "member":
            User.findOne({
                _id: payload._id
            },
                function (err, user) {
                    if (err) {
                        return done(err, false)
                    }
                    if (user) {
                        return done(null, user)
                    } else {
                        return done(null, false)
                    }
                })
            break;
        case "admin":
            Admin.findOne({
                _id: payload._id
            },
                function (err, user) {
                    if (err) {
                        return done(err, false)
                    }
                    if (user) {
                        return done(null, user)
                    } else {
                        return done(null, false)
                    }
                })
            break;
        default:
            break;
    }
})

// const faceStrategy = new facebookStrategy({
//     clientID: configKey.CLIENT_ID,
//     clientSecret: configKey.CLIENT_SECRET,
//     callbackURL: "http://localhost:7000/auth/facebook/callback",
//     profileFields: ['id', 'displayName', 'photos', 'email']
// },
//     function (accessToken, refreshToken, profile, cb) {
//         User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//             return cb(err, user);
//         });
//     }
// )

module.exports = (passport) => {
    passport.use(strategyJWT)
    // passport.use(faceStrategy)
}


