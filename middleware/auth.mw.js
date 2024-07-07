
const userModel= require("../models/user.model")

exports.verifySignUpBody=async (req,res,next)=>{
    try{
        //check for name
        if(!req.body.username){
            return res.status(400).send({
                message:"User Name not provided"
            })
        }
        //check for mobile
        if(!req.body.Mobile){
            return res.status(400).send({
                message:"Mobile not provided"
            })
        }
        //check for password
        if(!req.body.password){
            return res.status(400).send({
                message:"Password not provided"
            })
        }
        //Check if userID is unique
        const user=await userModel.findOne({Mobile:req.body.Mobile})
        if(user){
            return res.status(400).send({
                message:"Mobile Number already registered"
            })
        }

        next()

    }catch(err){
        console.log("Error in validating request body ",err)
        res.status(500).send({
            message:"Error while validating data"
        })
    }
}

exports.verifySignInBody=async (req,res,next)=>{
    // check if all information is provided or not
    try{
        if(!req.body.Mobile){
            return res.status(400).send({
                message: "Mobile Number not provided"
            })
        }

        if(!req.body.password){
            return res.status(400).send({
                message: "Password is not provided"
            })
        }

        next()
    }catch(err){
        console.log("Error in validating signIn data ", err)
        res.status(500).send({
            message: "Error while validating data"
        })
    }
}