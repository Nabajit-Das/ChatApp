const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const user=require("../models/user.model")
const auth=require("../configs/auth.configs")

exports.signUp=async (req,res)=>{
    const reqBody=req.body
    const newUser={
        username:reqBody.username,
        Mobile:reqBody.Mobile,
        password:bcrypt.hashSync(reqBody.password,8)
    }
    try{
        const createduser=await user.create(newUser)
        res.status(201).send({
            message:"User created successfully",
            createduser
        })
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            message:"Error while creating user"
        })
    }
    
}

exports.signIn=async (req,res)=>{
    const reqBody=req.body
    const userFound= await user.findOne({Mobile:reqBody.Mobile})
    if(userFound===null){
        res.status(404).send({
            message:"User not found"
        })
        return
    }
    else{
        const passwordIsValid=bcrypt.compareSync(reqBody.password,userFound.password)
        if(passwordIsValid){
            const token=jwt.sign({id:userFound.id},auth.secret,{expiresIn:'1h'})
            res.status(200).send({
                id:userFound._id,
                username:userFound.username,
                Mobile:userFound.Mobile,
                accessToken:token
            })
        }
        else{
            res.status(401).send({
                accessToken:null,
                message:"Invalid Password"
            })
        }
    }
}

