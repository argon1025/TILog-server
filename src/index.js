const express = require("express");

const app = express();
app.get("/", (req, res) => {
    res.send("Hello World");
});

const PORT = 8001;
const HOST = "0.0.0.0";
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
/*
if(process.env.NODE_PORT&&process.env.NODE_HOST){
    const PORT = process.env.NODE_PORT;
    const HOST = process.env.NODE_HOST;
    app.listen(PORT, HOST);
    console.log(`Running on http://${HOST}:${PORT}`);
}else{
    const PORT = 8080;
    const HOST = "localhost";
    app.listen(PORT, HOST);
    console.log(`Running on dev http://${HOST}:${PORT}`);
}
*/