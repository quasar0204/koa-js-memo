const Koa = require('koa');

const app = new Koa();

const bodyParser = require('koa-bodyparser');
const sequelize = require('./database/models').sequelize;
const json = require('koa-json');
const views = require('koa-views');
const session = require('koa-session');
const passport = require('koa-passport');
const passportConfig = require('./config/passport.js');

app.use(views('views', {
    root: __dirname + '/views',
    default: 'ejs'
}));

sequelize.sync().then(() => {
    console.log('DB 연결 성공');
}).catch((err) => {
    console.error('DB 연결 실패');
    console.log(err);
})

app.keys = ['secret'];
app.use(session({}, app));

app.use(bodyParser());
app.use(json());

app.use(passport.initialize());
app.use(passport.session());

const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const registerRouter = require('./routes/register');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment')

app.use(loginRouter.routes(), loginRouter.allowedMethods());
app.use(logoutRouter.routes(), logoutRouter.allowedMethods());
app.use(registerRouter.routes(), registerRouter.allowedMethods());
app.use(postRouter.routes(), postRouter.allowedMethods());
app.use(commentRouter.routes(), commentRouter.allowedMethods());

passportConfig(passport);

app.listen(3000, () => {
  console.log('Koa server is listening to port 3000');
});

module.exports = app;