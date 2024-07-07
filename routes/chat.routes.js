const chatcontroller = require("../controllers/chat.controller");
const chatmw = require("../middleware/chat.mw");

module.exports = (app)=>{
    app.post("/api/chat/send",[chatmw.verifyChatBody,chatmw.verifyUsers],chatcontroller.sendMessage)
}