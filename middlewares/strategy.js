const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.JWT_SECRET
}

const strategy = new JwtStrategy(jwtOptions, (payload, done) => {
    console.log("payload received: ", payload);

    if (payload) {
        done(null, {
            _id: payload._id,
            userName: payload.userName
        })
    }
    else {
        next(null, false)
    }
})

module.exports = { strategy }