const { Post } = require('../database/models');

exports.PostAuth = async (ctx, next) => {
    const post = await Post.findOne({ where: {id: ctx.params.id} });
    console.log('ctx.state.user.id', ctx.state.user.id, 'post.userId', post.userId);
    if (ctx.state.user.id == post.userId) {
        console.log('작성자 입니다.');
        await next();
    }
    else {
        console.log('권한이 없습니다.');
        return ctx.redirect('/post');
    }
};