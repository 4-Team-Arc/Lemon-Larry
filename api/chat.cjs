const express = require("express")
const app = express();
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors");

app.use(cors());

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on("send_message", (data) => {
    console.log(data) 

    io.emit(data)

  });
})

server.listen(3001, () => {
  console.log(`YESSIRSKI`)
});



 