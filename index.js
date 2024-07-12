const express=require('express');
const mongoose=require('mongoose');
const http=require('http');
const bcrypt=require('bcryptjs');
const serverConfig=require('./configs/server.configs.js');
const dbConfig=require('./configs/db.config.js');
const cors=require('cors');
const socketio=require('socket.io');
const chatcontroller=require('./controllers/chat.controller.js');

const app=express();
const server=http.createServer(app);
const io=socketio(server);

app.use(cors());
app.use(express.json());

mongoose.connect(dbConfig.DB_URL)
const db=mongoose.connection
db.on("error",()=>{
    console.log("Error in connecting to the database")
})
db.once("open",()=>{
    console.log("Connected to the database")
})

require("./routes/auth.routes.js")(app)
require("./routes/chat.routes.js")(app)

chatcontroller.handleConnection(io)

app.use((req,res,next)=>{
    req.io=io;
    next()
})

app.listen(serverConfig.PORT,()=>{
    console.log("Server is running on port "+serverConfig.PORT)
})
