
const user=require('../models/user.model.js')

exports.verifyChatBody= async (req,res,next)=>{
    try{
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
 
        res.status(500).send({
            message:"Error while validating chat data"
        })
    }
}

exports.verifyChatswith=async(req,res,next)=>{
    try{
        if(!req.body.Mobile){
            return res.status(400).send({
                message:"Friend ID not provided"
            })
        }
        next()
    }
    catch(err){
        res.status(500).send({
            message:"Error while validating friend mobile"
        })
    }
}

