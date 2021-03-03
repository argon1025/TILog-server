/**
 * Routes index
 * /api 에 접속했을때 대응되는 라우트 설정 입니다
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

///////////////////////////////////// => 라우팅
const v1 = require("./v1");
router.use("/v1", v1);
/////////////////////////////////////

module.exports = router;
