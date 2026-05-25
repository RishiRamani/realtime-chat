import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors());

const server = createServer(app);

const io = new Server(server,
  {
    cors:{
      origin:"http://localhost:5173"
    }
  }
);

//Whenever any client connects to server each socket must listen the following
io.on("connection",(socket)=>{
  //Upon join msg set username and emit a reply to all clients confirming join
  socket.on("join",(message)=>{
    if(!socket.data.username){
      socket.data.username = message.username;
    }
    //reply
    io.emit("reply",{
    id:crypto.randomUUID(),
    type:"join",
    username:"System",
    text:socket.data.username,
    createdAt:Date.now()
    })
  })
  //if user starts typing inform all clients he's typing
  socket.on("typing-start",(message)=>{
    if(!socket.data.username){
      socket.data.username = message.username;
    }
    io.emit("typing-yes",{
      username:socket.data.username
    })
  })
  //if user stops typing inform everyone he has stopped typing
  socket.on("typing-stop",(message)=>{
    if(!socket.data.username){
      socket.data.username = message.username;
    }
    io.emit("typing-no",{
      username:socket.data.username
    })
  })
  //upon recieving a message send a reply to all clients
  socket.on("message",(message)=>{
    if(!socket.data.username){
      socket.data.username = message.username;
    }
    io.emit("reply",{
      id:crypto.randomUUID(),
      type:"message",
      username:message.username,
      text:message.message,
      createdAt:Date.now()
    })
  })
  console.log("User connected:",socket.id);
  //upon disconnection of client inform all users
  socket.on("disconnect",()=>{
    io.emit("reply",{
      id:crypto.randomUUID(),
      type:"leave",
      username:"System",
      text:socket.data.username,
      createdAt:Date.now()
    })
    io.emit("typing-no",{
      username:socket.data.username
    })
    console.log("User disconnected:",socket.id)
  });
});

server.listen(3000,()=>{
  console.log("Server running on PORT 3000");
})
