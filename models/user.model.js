const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    sent:{
        type:Boolean,
        required:true
    },
    timeStamp:{
        type:Date,
        default:Date.now
    }
    
},{_id:false})

const chatSchema=new mongoose.Schema({
    with:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    messages:[messageSchema]
})
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    Mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    chats:[chatSchema]
    
},{timestamps:true,versionKey:false})


userSchema.methods.addChat=function(friend){
    const chat=this.chats.find(chat=>chat.with.toString()===friend._id.toString())
    if(chat){
        return chat
    }
    else{
        const newChat={
            with:friend._id,
            messages:[]
        }
        this.chats.push(newChat)
        return newChat
    }
}

module.exports=mongoose.model('User',userSchema)