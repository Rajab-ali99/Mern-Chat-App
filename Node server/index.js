const express = require ('express')
const cors = require('cors')
const connectDB = require('./config/connectDB')
const router = require('./routes/index')
const cookieParser = require('cookie-parser')
const {app,server} = require('./socket/index')
require('dotenv').config()
// const app = express()
const PORT = process.env.PORT || 8080
app.use(cookieParser())
app.use(cors({
     origin: process.env.FRONTEND_URL ,
     credentials: true,
}))
app.use(express.json())
app.get('/',(request,response)=>{
    response.json({
        message: "server is runing at " + PORT
    })
})
// api endpoints
app.use('/api',router)
     connectDB().then(()=>{
        console.log("server is runing at" + PORT)
     })
