const express = require("express");
const { createServer } = require("node:http");
const path = require("path");
const app = express();
const { Server } = require("socket.io");

const Store = require("./cfStore");

const store = new Store();

// #############################################################################
// Logs all request paths and method
app.use(function (req, res, next) {
  res.set("x-timestamp", Date.now());
  res.set("x-powered-by", "cyclic.sh");
  console.log(
    `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`
  );
  next();
});

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
var options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["htm", "html", "css", "js", "ico", "jpg", "jpeg", "png", "svg"],
  index: ["index.html"],
  maxAge: "1s",
  redirect: false,
};
app.use(express.static("public", options));

//middleware function is now defined that will be executed for every request to the server.
// app.use(function (req, res, next) {
//   console.log("middleware");
//   req.testing = "testing";
//   //next middleware function in the chain is called
//   return next();
// });

// #############################################################################
// Catch all handler for all other request.
app.use("*", (req, res) => {
  res
    .json({
      at: new Date().toISOString(),
      method: req.method,
      hostname: req.hostname,
      ip: req.ip,
      query: req.query,
      headers: req.headers,
      cookies: req.cookies,
      params: req.params,
    })
    .end();
});

/*
 * get initial data from cloudflare
 */
let numConnected = 0;
let flowers = [];

store.getAll().then((data) => {
  flowers = data;
});

const server = createServer(app);
const io = new Server(server);

function updateNumConnected(io, num) {
  numConnected = num;
  io.emit("num_connected", num);
}

async function handleClick(io, data) {
  let flower = await store.newFlower(data);
  flowers.push(flower);
  io.emit("new_flower", flower);
}

async function clear() {
  store.clear();
  flowers = [];
  io.emit("clear");
}

io.on("connection", (socket) => {
  updateNumConnected(io, numConnected + 1);
  socket.emit("initial_flowers", flowers);
  socket.on("click", (data) => handleClick(io, data));
  socket.on("clear", clear);

  socket.on("disconnect", () => {
    updateNumConnected(io, numConnected - 1);
  });
});

module.exports = server;
