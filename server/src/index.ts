import * as express from "express"
import { Server } from "ws"
import { readFile } from "fs"
import cors from "cors"
var pm2 = require('pm2');

const app = express()
const port = 3001
let wss: Server;
import * as http from "http";
// console.log("Start")
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/data', (req, res) => {
  console.log("Hello back");
  readFile("./outtext.txt", (err, data) => {
    if (err == null) {
      res.send(data.toString())
    }
  })
})

const server = http.createServer(app)
wss = new Server({ server });
wss
wss.on("error", (err) => {
  console.log("Error" + err)
});

let newConnection = (ws) => {
  console.log("New connection: " + ws)
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send("Received message: " + message)
  });
  pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
    pm2.launchBus(function (err, bus) {
    console.log("connected bus")
    bus.on('log:out', function(packet) {
      ws.send(JSON.stringify(packet));
    });
  })  
});
  ws.send("Welcome to the server");
}
wss.on("connection", newConnection);
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  console.log("Hello from index.js")
})

