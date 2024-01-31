const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDb = require('./utils/db');
const app = express();
const socket = require("socket.io");
const http = require('http');
const userRoutes = require('./routes/userRoutes');
const messageRoute = require('./routes/messagesRoute');
require("dotenv").config();


app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);



const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

connectDb().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});




const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-receive", data.msg);
      }
    });
  });


module.exports = app;

