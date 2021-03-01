/**
 * Routes index
 * /api/v1 에 접속했을때 대응되는 라우트 설정 입니다
 *
 *
 * @ author leeseongrok(argon1025@gmail.com) - 2021.2.11
 * @ version 1.0
 *
 */
///////////////////////////////////// => 모듈 로드
const express = require("express");
const router = express.Router();
/////////////////////////////////////

///////////////////////////////////// => 컨트롤러 임포트
const accounts = require('./accounts/controllers/account.controller')
const posts = require('./posts/controllers/post.controller')
const comments = require('./comments/controllers/comment.controller')
/////////////////////////////////////

///////////////////////////////////// => 게시글 관련 라우팅
// GET /api/v1/posts
// 전체 게시글을 조회 하고자 할때 사용합니다
// GET /api/v1/posts?userid=""
// 전체 게시글리스트에서 특정 userid의 데이터만 필터링합니다
router.get("/posts",posts.sayHelloWorld)

// GET /api/v1/posts/:postid
// postid를 가진 게시글의 데이터를 조회합니다
router.get("/posts/:postid",posts.sayHelloWorld)

// GET /api/v1/posts/:postid/tags
// postid를 가진 게시글의 Tag 데이터를 조회합니다
router.get("/posts/:postid/tags",posts.sayHelloWorld)

// POST /api/v1/posts
// 게시글을 등록합니다
router.post("/posts",posts.sayHelloWorld)

// PUT /api/v1/posts/:postid
// postid를 가진 게시글을 수정합니다
router.put("/posts",posts.sayHelloWorld)

// DELETE /api/v1/posts/:postid
// postid를 가진 게시글을 삭제합니다
router.delete("/posts/:postid",posts.sayHelloWorld)

///////////////////////////////////// => 댓글 관련 라우팅
// GET /api/v1/posts/:postid/comments
// postid에 등록된 comment를 조회합니다
// comments.controller
router.get("/posts/:postid/comments",comments.sayHelloWorld);

// POST /api/v1/posts/:postid/comments
// postid에 comment를 등록합니다
router.post("/posts/:postid/comments",comments.sayHelloWorld);

// DELETE /api/v1/posts/:postid/comments/:commentid
// postid에 comment를 삭제합니다
router.delete("/posts/:postid/comments/:commentid",comments.sayHelloWorld);

// PUT /api/v1/posts/:postid/comments/:commentid
// postid에 comment를 수정합니다
router.put("/posts/:postid/comments/:commentid",comments.sayHelloWorld);

///////////////////////////////////// => 태그 관련 라우팅
// GET /api/v1/tags
// 전체 유저의 태그 리스트를 조회합니다
// GET /api/v1/tags?userid=""
// 전체 유저의 태그 리스트 중에서 특정 userid의 데이터만 필터링합니다

// GET /api/v1/tags/:tagname/posts
// tagname을 가진 모든 포스트 리스트를 조회합니다
// GET /api/v1/tags/:tagname/posts?userid=""
// tagname을 가진 모든 포스트 중에서 특정 userid가 작성한 포스트만 필터링합니다

/////////////////////////////////////
module.exports = router;
