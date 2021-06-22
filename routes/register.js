const Router = require('koa-router');
const router = new Router();
const passport = require('koa-passport');
const bcrypt = require('bcrypt');
const { User } = require('../database/models');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/loginMiddlewares');

router.get('/register', async (ctx) => {
    ctx.body = '회원가입 페이지';
})

router.post('/register', async (ctx) => {
    const { email, nick, password } = ctx.request.body;

    const isExUser = await User.findOne({
        where : {email: email}
    });

    if (isExUser) {
        console.log('이미 가입된 이메일입니다.');
        return ctx.redirect('/auth/register');
    }

    const hash = await bcrypt.hash(password, 15);

    await User.create({
        email,
        nick,
        password: hash,
    });
    console.log(email, nick, password, hash);
    console.log('회원가입 성공');

    return ctx.redirect('/');
})

module.exports = router;