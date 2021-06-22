const local = require('./localStrategy');
const { User } = require('../database/models');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        console.log('serializeUser 호출됨');

        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        console.log('deserializeUser 호출됨');
        
        try {
            const user = await User.findOne({where: {id}});
            done(null, user);
        } catch(err) {
            done(err);
        }
    });

    local(passport);
}