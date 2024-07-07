const user=require("../models/user.model")



exports.sendMessage=async (req,res)=>{
    const senderId=req.body.senderId
    const receiverId=req.body.receiverId
    const message=req.body.message
    try{
        const sender=await user.findOne({Mobile:senderId})
        const receiver=await user.findOne({Mobile:receiverId})
        

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

        res.status(200).send({
            message:"Message sent successfully"
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            message:"Error while sending message"
        })
    }
}