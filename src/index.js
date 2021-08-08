///////////////////////////////////// => 공식 모듈 로드
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
/////////////////////////////////////

///////////////////////////////////// => 제작 모듈 로드

/////////////////////////////////////

///////////////////////////////////// => 라우팅
const indexRouter = require("./routes");
app.use("/api", indexRouter);
/////////////////////////////////////

if (process.env.NodeJS_HOST && process.env.NodeJS_PORT) {
    // 서버 시작
    const PORT = process.env.NodeJS_PORT;
    const HOST = process.env.NodeJS_HOST;
    app.listen(PORT, HOST);
    console.log(`Running on http://${HOST}:${PORT}`);
} else {
    const PORT = 8080;
    const HOST = "localhost";
    app.listen(PORT, HOST);
    console.log(`Running on dev http://${HOST}:${PORT}`);
}
