exports.isLoggedIn = async (ctx, next) => {
    console.log('isLoggedIn 호출됨');

    if (ctx.isAuthenticated()) {
        await next();
    }
    else {
        console.log('로그인이 필요합니다.');
        ctx.state = 403;
    }
};

exports.isNotLoggedIn = async (ctx, next) => {
    console.log('isNotLoggedIn 호출됨');

    if (!ctx.isAuthenticated()) {
        console.log('로그인 안됨')
        await next();
    }
    else {
        console.log('이미 로그인된 상태입니다.')
        ctx.redirect('/');
    }
};