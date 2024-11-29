const userModel = require('../Models/userModel')
const bcryptjs = require('bcryptjs')
async function userRegister (request,response){
    try {
        const {name,email,password,profile_pic} = request.body
        const checkmail= await userModel.findOne({email})
        if(checkmail){
            return response.status(400).json({
               message: 'User Already exists' ,
               error:true
            })
        }
        // password to hashpassword
       const salt = await bcryptjs.genSalt(10)
       const hashpassword = await bcryptjs.hash(password , salt)
       const payload ={
        name,
        email,
        profile_pic,
        password:hashpassword
       }
       const user = new userModel(payload)
       const usersave = await user.save()
       return response.status(201).json({
        message: 'User created successfully',
        data: usersave,
        success:true
       })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}
module.exports= userRegister