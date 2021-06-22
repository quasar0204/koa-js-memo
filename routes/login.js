const Router = require('koa-router');
const router = new Router();
const passport = require('koa-passport');
const bcrypt = require('bcrypt');
const { User } = require('../database/models');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/loginMiddlewares');

router.get('/login', isNotLoggedIn, async (ctx) => {
    console.log()
    ctx.body = '로그인 페이지';
})

router.post('/login', isNotLoggedIn, async (ctx) => {
    console.log('post - /auth/login 실행');

    return passport.authenticate('local', async function(err, user, info, status) {
        if (err) {
            next(err);
        }

        if (user) {
            return await ctx.login(user);
        } else {
            ctx.status = 400;
            return ctx.redirect('/login');
        }
    })(ctx);
})

router.get('/auth/logout', async (ctx) => {
    
})

module.exports = router;