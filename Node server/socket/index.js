const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const cors = require('cors')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const userModel = require('../Models/userModel')
const { conversationModel, messageModel } = require('../Models/conversationModel')
const getConversation = require('../helpers/getConversation')


const app = express()
/**socket connection */
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})
const onlineUser = new Set()
/**socket running at http://localhost:8080/ */
io.on('connection', async (socket) => {
    console.log('connect user', socket.id)
    const token = socket.handshake.auth.token
    /**current user details */
    const user = await getUserDetailsFromToken(token)
    /**create a room */
        const userid = user?._id.toString()
    socket.join(userid)
    onlineUser.add(user?._id?.toString())

    io.emit('onlineUser', Array.from(onlineUser))
    socket.on('message-page', async (userId) => {
        const userDetails = await userModel.findById(userId).select('-password')
        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId)

        }
        socket.emit('message-user', payload)
        // Get previous conversation
        const getConversationMessage = await conversationModel.findOne({
            '$or': [
                { sender: user?._id, receiver: userId },
                { sender: userId, receiver: user?._id }
            ]
        }).populate('messages').sort({ updatedAt: -1 })
        socket.emit('message', getConversationMessage?.messages || [])
        socket.emit('message', getConversationMessage?.messages || [])
        

    })
    // new message
    socket.on('send message', async (data) => {
        let conversation = await conversationModel.findOne({
            '$or': [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        })


        //if conversation is not available
        if (!conversation) {
            const createConversation = await conversationModel({
                sender: data?.sender,
                receiver: data?.receiver,

            })
            conversation = await createConversation.save()
        }
        const message = new messageModel({
            text: data.text,
            ImageUrl: data.ImageUrl,
            videoUrl: data.videoUrl,
            msgByUserId: data?.msgByUserId
        })
        const saveMessage = await message.save()
        const updateConversation = await conversationModel.updateOne({ _id: conversation?._id }, {
            "$push": { messages: saveMessage?._id }
        })
        const getConversationMessage = await conversationModel.findOne({
            '$or': [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        }).populate('messages').sort({ updatedAt: -1 })
        io.to(data?.sender).emit('message', getConversationMessage?.messages || [])
        io.to(data?.receiver).emit('message', getConversationMessage?.messages || [])
        console.log('conversation', getConversationMessage)
        // get conv on sidebar
        const conversationSender = await getConversation(data?.sender)
        const conversationReceiver = await getConversation(data?.receiver)
        io.to(data?.sender).emit('conversation', conversationSender)
        io.to(data?.receiver).emit('conversation', conversationReceiver)
    })
    
    //Sidebar
    socket.on('Sidebar', async (currentUserId) => {
        console.log('current User', currentUserId)
        const conversation = await getConversation(currentUserId)
        socket.emit('conversation',conversation)
    })
    //seen
    socket.on('seen',async(msgByUserId)=>{
        let conversation = await conversationModel.findOne({
            '$or': [
                { sender: user?._id, receiver: msgByUserId },
                { sender: msgByUserId, receiver: user?._id }
            ]
        })

        const conversatonMsgId = conversation?.messages || [] 
        const updateMsg = await messageModel.updateMany(
            {_id : {'$in' : conversatonMsgId}, msgByUserId: msgByUserId},
            {'$set' : {seen : true}}
        )

        const conversationSender = await getConversation(user?._id.toString())
        const conversationReceiver = await getConversation(msgByUserId)
        io.to(user?._id.toString()).emit('conversation', conversationSender)
        io.to(msgByUserId).emit('conversation', conversationReceiver)
    })
   // disconnect
    socket.on('disconnect', () => {
        onlineUser.delete(user?._id.toString())
        console.log("disconnected user", socket?.id)
    })
})

module.exports = {
    app,
    server
}