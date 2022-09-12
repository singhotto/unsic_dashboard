const express = require("express");
const mongoose = require("mongoose");
const fileupload = require("express-fileupload");
const app = express();
const cors = require("cors");
const { Client, MessageMedia } = require("whatsapp-web.js");
const { clientSchema } = require("./mongo/schema");
const fs = require("fs");

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
const uploadPath = __dirname + "/uploads/"

app.use(cors());
app.set('port', port);
app.use(express.json());
app.use(fileupload());
app.use(express.static("files"));
app.use(require("./routes/admin"));

// get driver connection
const dbo = require("./db/conn");

//socket.io
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
process.title = "caf_unsic_dashboard";
process.setMaxListeners(0);

io.on("connection", (socket) => {
  const client = new Client({
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    },
  });

  fs.readdir(uploadPath, (err, files) => {
    if (err) console.log(err);
  
    for (const file of files) {
      fs.unlink(`${uploadPath}${file}`, err => {
        if (err) console.log(err);
      });
    }
  });

  client.on("qr", (qr) => {
    socket.emit("getQr", qr);
  });

  client.on("ready", () => {});

  client.on("authenticated", () => {
    socket.emit("connected");
  });

  client.on("auth_failure", () => {
    console.log("AUTH Failed !");
    process.exit();
  });

  client.on("disconnected", () => {
    console.log("disconnected");
    socket.emit("disconnected");
  });

  socket.on("send", (filter) => {
    const { nazione, comune, msg, fileName } = filter;
    let q = {};
    if (comune.length > 0 && nazione != "All") {
      q["comune"] = comune;
      q["nazione"] = nazione;
    } else if (nazione != "All") {
      q["nazione"] = nazione;
    } else if (comune.length > 0) {
      q["comune"] = comune;
    }
    async function sendMsg() {
      const response = await clientSchema
        .find(q)
        .select({ telefono: 1, _id: 0 });
      if (response) {
        for (let i = 0; i < response.length; i++) {
          const number = response[i].telefono;
          if(!number)continue;
          const chatId = number.substring(1) + "@c.us";
          socket.emit('count', i+1);
          if (fileName == "") {
            await client.sendMessage(chatId, msg);
          } else {
            const newpath = uploadPath+fileName;
            const media = MessageMedia.fromFilePath(newpath);
            await client.sendMessage(chatId, media, {
              caption: msg,
            });
          }
        }
      }
    }
    sendMsg();
    if(fileName){
      fs.unlink(uploadPath+fileName);
    }
    socket.emit('done');
  });

  client.initialize();
});

server.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log("Server is running on port:", port, " started at:", new Date());
});
