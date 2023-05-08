import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//protected routes token base
export const requireSignIn = async (req,res,next)=>{
    try {
        const decode = JWT.verify(req.headers.authorization,process.env.JWT_SECRET) //token is store in header not in req.body
         req.user = decode //decode return a object with id which is send to req as user
        next()
    } catch (error) {
        res.status(401).send({
            success: false,
            message:'not an admin account'
        })
    }
}

//is admin check
export const  isAdmin  = async (req,res,next) =>{
    try {
        const user = await userModel.findById(req.user._id)//get user decode id from up function
        if(user.role !== 1 ){
            return res.status(401).send({
                success:false,
                message:"auth failed"
            })
        }
        else{
            next()
        }
    } catch (error) {
        
        res.status(401).send({
            success: false,
            message:'not an admin account'
        })
    }
}