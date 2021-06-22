exports.isLoggedIn = (ctx, next) => {
    console.log('isLoggedIn 호출됨');

    if (ctx.isAuthenticated()) {
        next();
    }
    else {
        console.log('로그인이 필요합니다.');
        ctx.state = 403;
    }
};

exports.isNotLoggedIn = (ctx, next) => {
    console.log('isNotLoggedIn 호출됨');

    if (!ctx.isAuthenticated()) {
        next();
    }
    else {
        console('이미 로그인된 상태입니다.')
        ctx.redirect('/');
    }
};