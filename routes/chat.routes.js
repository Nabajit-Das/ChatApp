const chatcontroller = require("../controllers/chat.controller");
const chatmw = require("../middleware/chat.mw");


module.exports = (app)=>{
    app.post("/api/chat/send",[chatmw.verifyChatBody],chatcontroller.sendMessage)
    app.get("/api/chat/chats",chatcontroller.showAllChats)
    app.get("/api/chat/chatswith",[chatmw.verifyChatswith],chatcontroller.showChatswith)
}