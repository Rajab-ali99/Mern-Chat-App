const userModel = require('../Models/userModel')
async function checkEmail(request,response){
    try {
        
        const {email}= request.body
        const checkmail= await userModel.findOne({email}).select("-password")
        if(!checkmail){
         return  response.status(400).json({
               message: "user not exist",
               error:true

           })
        }
       return response.status(200).json({
            message: "email verified",
            data: checkmail,
            success:true
        })
    } catch (error) {
       return response.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}
module.exports = checkEmail