const userModel = require("../Models/userModel")

async function searchUser(request,response){
    try {
        const {search} =request.body
        const querry = new RegExp(search,'i','g')
        const user = await userModel.find({
            '$or' : [
                {'name' : querry},
                {'email' : querry}
            ]
        })
        return response.json({
            message: 'All User',
            data: user,
            success: true
        })
    } catch (error) {
       return response.status(500).json({
             message: error.message || error,
             error:true
        })
    }
}
module.exports = searchUser