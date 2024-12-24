import { Router } from 'express';
import User from '../controllers/user.js';
import authenticateToken from '../middleware/authenticationToken.js';
import upload from '../middleware/multerConfig.js';
//import checkPermissions from '../middleware/checkPermissions.js';
//import validateApiKey from '../middleware/validateApyKey.js';

const router = Router();


//Routes to retrieve data from the database


//Route to get all users from the database
router.get('/',User.getAllUsers);

//Route to get filtered users from the database
router.get('/filter',User.filterUsers);

//route to get user profile
router.get('/profile',User.getProfile)


//Route to get user income history by name
router.get('/loginHistory',User.getLoginHistory)


// Route to get user profile
router.get('/profile/:id' ,User.getUserProfile)


//Route to get all users with pagination
router.get('/pagination',User.getUsersWithPagination)


//Route to add a new user

router.post('/',User.addUser);



//Route to get a user by id
router.get('/:id',User.getUserById);


//Route to insert multiple users
router.post('/bulk',authenticateToken,upload.array('image'),User.bulkUsers)

//Route to delete multiple users
router.post('/deleteMultiple',User.deleteMultiple)

//Route to request the password reset
router.post('/requestPasswordReset',User.requestPasswordReset)

//Route to reset the password 
router.post('/resetPassword/:token',User.resetPassword)

//Route to login
router.post('/login',User.login)

//Route to update user

router.put('/:id', User.update);


//Route the change the user status

router.put('/:id/:status',User.changeStatus)

//Route to delete user

router.delete('/:id', User.deleteUser);

//Route to update partial

router.patch('/:id', User.partialUpdate)




export default router;