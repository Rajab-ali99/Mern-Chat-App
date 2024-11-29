const jwt = require('jsonwebtoken')
const UserModel = require('../Models/userModel')
const getUserDetailsFromToken = async(token)=>{
    if(!token){
      return{
          message:"session out",
          Logout: true
      }
  }
    const decode= await jwt.verify(token,process.env.JWT_SECEREAT_KEY)
    const details= await UserModel.findById(decode.id).select('-password')
    return details 
}
module.exports = getUserDetailsFromToken