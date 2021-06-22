const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../database/models');

module.exports = async (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
            console.log(email, password);
            console.log('./config/passport 실행됨');
            const exUser = await User.findOne({where : { email } });
        
            if (!exUser) {
                console.log('가입되지 않은 회원입니다.');
                return done(null, false, {message: '가입되지 않은 회원입니다.'});
            }
        
            const result = await bcrypt.compare(password, exUser.password);

            if (result) {
                console.log('로그인 성공!!');
                return done(null, exUser);
            }
            else {
                console.log('비밀번호가 일치하지 않습니다.');
                return done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
            }
        
        }
    ))
}