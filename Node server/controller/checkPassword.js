const bcryptjs = require('bcryptjs')
const userModel = require('../Models/userModel')
const jwt =require('jsonwebtoken')
async function checkPassword(request,response){
    try {
        const {password,userId} = request.body
        const user = await userModel.findById(userId)
        const verifypassword = await bcryptjs.compare(password,user.password)
        if(!verifypassword){
           return response.status(400).json({
            message: "please check password",
            error:true
           })
        }  
         const tokenData= {
            id: user._id,
            email: user.email
         }
         const token = await jwt.sign(tokenData,process.env.JWT_SECEREAT_KEY,{expiresIn:'1d'})
         const cookieOptions={
            http:true,
            secure:true
         }
        return response.cookie('token',token,cookieOptions).status(200).json({
            message: "login successfully",
            token: token,
            success: true
        })      
    } catch (error) {
       return response.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}
module.exports= checkPassword