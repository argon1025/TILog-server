const express = require("express");

const app = express();
app.get("/", (req, res) => {
    res.send("Hello World");
});

if(process.env.NodeJS_HOST&&process.env.NodeJS_PORT){
    const PORT = process.env.NodeJS_PORT;
    const HOST = process.env.NodeJS_HOST;
    app.listen(PORT, HOST);
    console.log(`Running on http://${HOST}:${PORT}`);
}else{
    const PORT = 8080;
    const HOST = "localhost";
    app.listen(PORT, HOST);
    console.log(`Running on dev http://${HOST}:${PORT}`);
}
