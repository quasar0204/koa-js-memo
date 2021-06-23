const Router = require('koa-router');
const { Comment, Post } = require('../database/models');
const { isLoggedIn } = require('../middlewares/loginMiddlewares');
const { CommentAuth } = require('../middlewares/authMiddlewares');
const router = new Router();

//댓글 생성
router.post('/post/:id/comment', isLoggedIn, async (ctx, next) => {
    let post = await Post.findOne({where : {id : ctx.params.id}});

    if (!post) {
        console.log('원글이 없습니다.');
        return;
    }

    const body = ctx.request.body;

    Comment.create({
        content: body.content,
        postId: ctx.params.id,
        userId: ctx.state.user.id
    }).then(result => {
        console.log('댓글 작성 성공');
        ctx.redirect('/post/:id');
    }).catch(err => {
        console.log(err);
        next(err);
    })
});

//댓글 삭제
router.delete('/post/:id/comment/:commentId', isLoggedIn, CommentAuth, async (ctx, next) => {
    let post = await Post.findOne({where : {id : ctx.params.id}});

    if (!post) {
        console.log('원글이 없습니다.');
        return;
    }

    const body = ctx.request.body;

    Comment.destroy({
        where: {id: ctx.params.commentId}
    }).then(result => {
        console.log("댓글이 삭제되었습니다.");
        ctx.redirect('/post/:id');
    }).catch(err => {
        console.log("댓글이 삭제되지 않았습니다.");
        console.log(err);
    })
});

//댓글 수정
router.patch('/post/:id/comment/:commentId', async (ctx, next) => {
    console.log('ctx.params', ctx.params);
    let post = await Post.findOne({where : {id : ctx.params.id}});

    if (!post) {
        console.log('원글이 없습니다.');
        return;
    }

    const body = ctx.request.body;
    console.log(body);
    Comment.update({
        content: body.editContent
    },{
        where: {id: ctx.params.commentId}
    }).then(result => {
        console.log("댓글이 수정되었습니다.");
        ctx.redirect('/post/:id');
    }).catch(err => {
        console.log("댓글이 수정되지 않았습니다.");
        console.log(err);
    })

});

module.exports = router;