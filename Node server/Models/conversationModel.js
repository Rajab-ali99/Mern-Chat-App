const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
    text:{
        type: String,
        default:''
    },
    ImageUrl:{
        type: String,
        default:''
    },
    videoUrl:{
        type: String,
        default:''
    },
    seen:{
        type: Boolean,
        default: false
    },
    msgByUserId:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref : 'User'
    }
},{
    timestamps:true
})
const conversationSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    receiver:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref : 'User'
    },
    messages:[
        {
         type: mongoose.Schema.ObjectId,
         ref : 'Message'
        }
    ],
},{
    timestamps:true
})
const conversationModel = mongoose.model('Conversation',conversationSchema)
const messageModel = mongoose.model('Message',messageSchema)
module.exports= {
    conversationModel,
    messageModel
}