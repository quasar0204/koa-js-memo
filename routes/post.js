const Router = require('koa-router');
const { User, Post, Comment } = require('../database/models');
const router = new Router();
const { isLoggedIn } = require('../middlewares/loginMiddlewares');
const { PostAuth } = require('../middlewares/authMiddlewares');

//전체 메모 리스트 조회 페이지네이션 미적용
/*
router.get('/post', async (ctx) => {
    let posts = await Post.findAll({
        order: [
            ['createdAt', 'ASC'],
            ['id', 'DESC']
        ],
        attributes: ['id', 'title', 'content', 'userId']
    });

    console.dir(posts);

    if (!posts || posts.length == 0) {
        ctx.status = 404;
        ctx.body = {
            message: '작성된 글이 없습니다.'
        };
        return;
    }

    ctx.body = posts;
});
*/

//메모 조회 페이지네이션
router.get('/post', async (ctx) => {
    let posts = await Post.findAll({
        order: [
            ['createdAt', ctx.query.sort ? ctx.query.sort : 'ASC'],
            ['id', 'DESC']
        ],
        limit: ctx.query.limit ? parseInt(ctx.query.limit) : null,
        offset: ctx.query.offset ? parseInt(ctx.query.offset) : 0,
        attributes: ['id', 'title', 'content', 'userId']
    });

    console.dir(posts);

    if (!posts || posts.length == 0) {
        ctx.status = 404;
        ctx.body = {
            message: '작성된 글이 없습니다.'
        };
        return;
    }

    ctx.body = posts;
});

//특정 메모 상세 조회
router.get('/post/:id', isLoggedIn, async (ctx) => {
    let post = await Post.findOne({
        where: {id: ctx.params.id},
        attributes: ['id', 'title', 'content'],
        include: {
            model: Comment,
            where: {postId: ctx.params.id},
            attributes: ['userId', 'content'],
            order: [
                ['createdAt', 'ASC']
            ]
        }
    });

    if (!post) {
        ctx.status = 404;
        ctx.body = {
            message: '해당 id의 포스트가 존재하지 않습니다.',
        };
        return;
    }

    ctx.body = post.dataValues;
})

//메모 생성
router.post('/post', isLoggedIn, async (ctx) => {
    const body = ctx.request.body;
    const logginUser = ctx.state.user;
    console.log(logginUser);
    Post.create({
        title: body.title,
        content: body.content,
        userId: logginUser.id
    }).then(result => {
        console.log("글이 작성되었습니다.");
        ctx.redirect('/post');
    }).catch(err => {
        console.log("글 작성 실패.");
        console.log(err);
    });
});

//메모 삭제
router.delete('/post/:id', isLoggedIn, PostAuth, async (ctx, next) => {
    Post.destroy({
        where: {id: ctx.params.id}
    }).then(result => {
        console.log("글이 삭제되었습니다.");
        ctx.redirect('/post');
    }).catch(err => {
        console.log("글이 삭제되지 않았습니다.");
        console.log(err);
    })
});

//메모 수정
router.patch('/post/:id', isLoggedIn, PostAuth, async (ctx) => {
    const body = ctx.request.body;
    Post.update({
        title: body.editTitle,
        content: body.editContent
    },{
        where: {id: ctx.params.id}
    }).then(result => {
        console.log("글이 수정되었습니다.");
        ctx.redirect('/post');
    }).catch(err => {
        console.log("글이 수정되지 않았습니다.");
        console.log(err);
    })
});

module.exports = router;