const user=require("../models/user.model")
const jwt=require("jsonwebtoken")
const authConfig=require("../configs/auth.configs")

const verifyToken=async(token)=>{

    if(!token){
        return null
    }
    try{
        const decoded= await new Promise((resolve,reject)=>{

            jwt.verify(token,authConfig.secret,async (err,decoded)=>{
                if(err){
                    reject (err)
                }
    
                else{
                    resolve(decoded)
                }
    
            })
        })
        const userFound=await user.findById(decoded.id);
        if(!userFound) return null
        return userFound.Mobile
        
    }
    catch(err){
        return null;
    }
    
}

exports.sendMessage=async (req,res)=>{
    try{
        const senderId=await verifyToken(req.headers["x-acess-token"])
        const receiverId=req.body.receiverId
        const message=req.body.message
        const sender=await user.findOne({Mobile:senderId})
        const receiver=await user.findOne({Mobile:receiverId})
        if(!sender){
            return res.status(404).send({
                message:"Sender not found"
            })
        }
        if(!receiver){
            return res.status(404).send({
                message:"Receiver not found"
            })
        }
        if(sender.Mobile===receiver.Mobile){
            return res.status(400).send({
                message:"You can't send message to yourself"
            })
        }

        const senderChat=sender.addChat(receiver)
        const receiverChat=receiver.addChat(sender)
       
        senderChat.messages.push({
            content:message,
            sent:true
        })
       
        receiverChat.messages.push({
            content:message,
            sent:false
        })
        

        await sender.save()
        await receiver.save()
        return res.status(200).send({
            message:"Message sent Successful"
        })
        
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            message:"Error while sending message"
        })
    }
}

exports.showAllChats=async(req,res)=>{
    try{
        const userMobile=await verifyToken(req.headers["x-acess-token"])
        const userFound=await user.findOne({Mobile:userMobile})
        if(!userFound){
            return res.status(404).send({
                message:"No such user Found"
            })
        }
        const chats=userFound.chats
        res.status(200).send({
            chats
        })
    }catch(err){
        res.status(500).send({
            message:"Error in Showing All Chats"
        })
    }
}

exports.showChatswith=async(req,res)=>{
    try{
        const userMobile=await verifyToken(req.headers["x-acess-token"])
        const userFound=await user.findOne({Mobile:userMobile})
        if(!userFound){
            return res.status(404).send({
                message:"No such user Found"
            })
        }
        const friend=await user.findOne({Mobile:req.body.Mobile})
        const chats=userFound.chats.filter(chat=>chat.with.equals(friend._id))
        res.status(200).send({
            chats
        })
    }
    catch(err){
        res.status(500).send({
            message:"Error in Showing chats"
        })
    }
}


exports.handleConnection=(io)=>{
    io.on("connection",(socket)=>{
        console.log("User Connected")
        socket.on("join",async (token)=>{
            const userMobile=await verifyToken(token)
            if(userMobile){
                socket.join(userMobile)
                console.log('User joined with Mobile Number: '+userMobile)
            }
        });

        socket.on("sendMessage",async ({token,receiverId,message})=>{
            const senderId=await verifyToken(token)
            const sender=await user.findOne({Mobile:senderId})
            const receiver=await user.findOne({Mobile:receiverId})
            if(!sender){
                return
            }
            if(!receiver){
                return
            }
            const senderChat=sender.addChat(receiver)
            const receiverChat=receiver.addChat(sender)
            senderChat.messages.push({
                content:message,
                sent:true
            })
            receiverChat.messages.push({
                content:message,
                sent:false
            })
            await sender.save()
            await receiver.save()
            io.to(sender.Mobile).emit("message",{
                message,
                receiverId,
                sent:true
            })
            io.to(receiver.Mobile).emit("message",{
                message,
                senderId,
                sent:false
            })
        })
    })
}