const PassportJwt = require('passport-jwt');
const PassportLocal = require('passport-local');

const User = require('../models/user.model');

const LocalStrategy = PassportLocal.Strategy;
const JWTStrategy = PassportJwt.Strategy;
const ExtractJwt = PassportJwt.ExtractJwt;


module.exports = (passport) => {

    passport.serializeUser((employee, done) => {
        console.log('serializeUser');
        done(null, employee._id);
    });
    
    passport.deserializeUser(async (_id, done) => {
        console.log('deserializeUser');
        try {
            const userRecord = await User.findOne({ _id });
            if (userRecord) {
            done(null, userRecord);
            }
        } catch (e) {
            done(e, null);
        }
    });
    
    passport.use(new LocalStrategy ({
        usernameField : 'email',
        passwordField : 'password',
        session : false
    }, localStrategyHandler));
    
    passport.use(new JWTStrategy ({
        jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey : process.env.JWT_SECRET
    }, jwtStrategyHandler));

    async function localStrategyHandler (email, password, done) {
        try {
            const userRecord = await User.findByCredentials(email, password);

            done(null, userRecord);
        } catch (e) {
            const isSystemError = typeof e !== 'string';
            if (!isSystemError) {
                return done(null, false, { message : e })
            }
            done(e, null)
        }
    }

    async function jwtStrategyHandler (jwtPayload, done) {
        try {
            const userRecord = await User.findOne({ _id : jwtPayload._id })
            if (!userRecord) {
                return done(null, false, { message : 'Invalid token' })
            }
            done(null, userRecord);
        } catch (e) {
            done(e);
        }
    }
}