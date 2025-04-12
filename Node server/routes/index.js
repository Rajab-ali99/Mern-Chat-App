const app= require('../index')
const serverless = require('serverless-http');
const userRegister = require('../controller/userRegister')
const checkEmail = require('../controller/checkEmail')
const checkPassword = require('../controller/checkPassword')
const userDetails = require('../controller/userDetails')
const logout = require('../controller/logout')
const updateUserDetails = require('../controller/updateUserDetails')
const searchUser = require('../controller/searchUser')
const router = express.Router()
// create user 
router.post('/register',userRegister)
// check email 
router.post('/email',checkEmail)
// check password 
router.post('/password',checkPassword)
// login user details 
router.get('/user-Details',userDetails)
// logout user 
router.get('/logout',logout)
// update user details 
router.post('/update-user',updateUserDetails)
// search User 
router.post('/search-user',searchUser)
module.exports= serverless(app);