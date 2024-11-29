const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const cors = require('cors')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const userModel = require('../Models/userModel')
const { conversationModel, messageModel } = require('../Models/conversationModel')


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
    socket.join(user?._id.toString())
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
    })
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
        const updateConversation = await conversationModel.updateOne({ _id : conversation?._id }, {
            "$push" : { messages : saveMessage?._id }
        })
        const getConversationMessage = await conversationModel.findOne({
            '$or': [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        })
        io.to(data?.sender).emit('message',getConversationMessage)
        io.to(data?.receiver).emit('message',getConversationMessage)
        console.log('conversation',getConversationMessage)
    })
    //disconnect
    socket.on('disconnect', () => {
        onlineUser.delete(user?._id)
        console.log("disconnected user", socket?.id)
    })
})

module.exports = {
    app,
    server
}