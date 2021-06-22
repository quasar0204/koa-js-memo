const Router = require('koa-router');
const router = new Router();
const passport = require('koa-passport');
const bcrypt = require('bcrypt');
const { User } = require('../database/models');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/loginMiddlewares');

router.get('/login', isNotLoggedIn, async (ctx) => {
    ctx.body = '로그인 페이지';
})

router.post('/login', isNotLoggedIn, async (ctx) => {
    console.log('post - /login 실행');

    return passport.authenticate('local', async function(err, user, info, status) {
        if (user) {
            return await ctx.login(user);
        } else {
            return ctx.redirect('/login');
        }
    })(ctx);
})


module.exports = router;