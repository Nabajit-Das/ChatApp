
const user=require('../models/user.model.js')

exports.verifyChatBody= async (req,res,next)=>{
    try{
        if(!req.body.senderId){
            return res.status(400).send({
                message:"Reciever ID not provided"
            })
        }
        if(!req.body.receiverId){
            return res.status(400).send({
                message:"Friend ID not provided"
            })
        }
        if(!req.body.message){
            return res.status(400).send({
                message:"Message not provided"
            })
        }
        next()
    }catch(err){
        console.log("Error in validating chat data ",err)
        res.status(500).send({
            message:"Error while validating chat data"
        })
    }
}

exports.verifyUsers=async (req,res,next)=>{
    try{
        const sender=await user.findOne({Mobile:req.body.senderId})
        const receiver=await user.findOne({Mobile:req.body.receiverId})
        if(!sender || !receiver){
            console.log("User not found")
            return res.status(404).send({
                message:"User not found"
            })
        }
        next()
    }
    catch(err){
        res.status(500).send({
            message:"Error while verifying users"
        })
    }
}