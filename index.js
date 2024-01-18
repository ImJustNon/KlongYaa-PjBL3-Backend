require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const socketIo = require("socket.io");
const fs = require("fs");
const path = require("path");

const config = require("./config/config.js");

const app = express();
const server = http.createServer(app);
const io = socketIo(server); 
require("./socket/server.js")(io);
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});
const jsonEncoded = express.json({
    limit: '50mb',
});
const logger = morgan("dev");


app.use(cors());
app.use(logger);
app.use(jsonEncoded);
app.use(urlEncoded);

// routes loader
fs.readdirSync(path.join(__dirname, "./routes")).forEach(async folder => {
    fs.readdirSync(path.join(__dirname, `./routes/${folder}`)).forEach(async file =>{
        try {
            let router = require(`./routes/${folder}/${file}`);
            app.use(router);
            console.log(('[Route] ') + (`Loaded : ${folder}/${file}`));
        }
        catch (e){
            console.log(('[Route] ') + (`Fail to Load : ${folder}/${file} : `) + (e));
        }
    });
});


require("./database/mysql_connection.js").connect();

function startListenPort(){
    server.listen(config.app.port);
}
server.on("listening", async() =>{
    console.log(("> ") + (`Localhost : ${config.app.address}:${config.app.port}`));
    console.log(("> ") + (`Listening on port : `) + (config.app.port));
});
server.on("error", (err) =>{
    console.log("[APP-ERROR] " + err);
});

startListenPort();

