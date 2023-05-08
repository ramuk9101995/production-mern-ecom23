import Express from "express";
import { registerController ,
    loginController,
    forgotPasswordController,
    updateProfileController,
    ordersController,
    allOrdersController,
    getAllUserController,
    orderStatusController} from "../controllers/registerController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = Express.Router();

//routing
//register||post method
router.post("/register", registerController);

//login || post method
router.post("/login",loginController)

//forget Password
router.post('/forgot-password',forgotPasswordController)

//test token
router.get("/tokentest",requireSignIn,isAdmin,(req,res)=>{    
    res.send('protected route')
})

//protected route user auth
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})

//protected route admin auth
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

//update user profile
router.put('/update-profile',requireSignIn,updateProfileController)

//orders
router.get('/orders',requireSignIn,ordersController)

//all orders
router.get('/all-orders',requireSignIn,isAdmin,allOrdersController)


//get all user
router.get('/all-users',requireSignIn,isAdmin,getAllUserController)

//order update
router.put('/order-status/:orderId',requireSignIn,isAdmin,orderStatusController)

//user order status change
router.put('/order-status-change/:orderId',requireSignIn,orderStatusController)

export default router; //send to the server.js
