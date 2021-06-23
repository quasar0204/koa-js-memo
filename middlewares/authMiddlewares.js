const { Post, Comment } = require('../database/models');

exports.PostAuth = async (ctx, next) => {
    let post = await Post.findOne({ where: {id: ctx.params.id} });

    if (!post) {
        console.log('게시글이 없습니다.')
        return ctx.redirect('/post');
    }

    if (ctx.state.user.id == post.userId) {
        console.log('작성자 입니다.');
        await next();
    }
    else {
        console.log('권한이 없습니다.');
        return ctx.redirect('/post');
    }
};

exports.CommentAuth = async (ctx, next) => {
    console.log('params', ctx.params);
    let comment = await Comment.findOne({ where: {id: ctx.params.commentId} });
    
    if (!comment) {
        console.log('댓글이 없습니다.')
        return ctx.redirect('/post');
    }
    console.log('ctx.state', ctx.state);
    if (ctx.state.user.id == comment.userId) {
        console.log('작성자 입니다.');
        await next();
    }
    else {
        console.log('권한이 없습니다.');
        return ctx.redirect('/post');
    }
}