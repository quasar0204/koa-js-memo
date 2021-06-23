const Router = require('koa-router');
const router = new Router();
const passport = require('koa-passport');
const bcrypt = require('bcrypt');
const { User } = require('../database/models');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/loginMiddlewares');

router.post('/logout', async (ctx) => {
    ctx.logout();
    ctx.session = null;
    return ctx.redirect('/login');
})

module.exports = router;