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

// routes 폴더 내에 있는거 등록하게 리펙토링 예정
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const registerRouter = require('./routes/register');
const usersRouter = require('./routes/users');

app.use(loginRouter.routes(), loginRouter.allowedMethods());
app.use(logoutRouter.routes(), logoutRouter.allowedMethods());
app.use(registerRouter.routes(), registerRouter.allowedMethods());
app.use(usersRouter.routes(), usersRouter.allowedMethods());

passportConfig(passport);

app.listen(4000, () => {
  console.log('Koa server is listening to port 4000');
});

module.exports = app;