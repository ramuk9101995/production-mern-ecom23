import { compparePassword, hashPassword } from '../helpers/authHelper.js';
import userModel from '../models/userModel.js'
import orderModel from '../models/orderModel.js'
import JWT from 'jsonwebtoken'
import { json } from 'express';

//this is send to router
export const registerController = async (req,res) => {
    try {
        const {name,email,password,phone,address,answer} = req.body
        if(!name){
           return res.send({message:'Name is Required'})
        }
        if(!email){
           return res.send({message:'Email is Required'})
        }
        if(!password || password.length<6){
           return res.send({message:'Password is Required or 6th character long'})
        }
        if(!phone){
           return res.send({message:'Phone no is Required'})
        }
        if(!address){
           return res.send({message:'Address is Required'})
        }
        if(!answer){
            return res.send({message:'Address is Required'})
         }
        
        //exiting email
        const existingUser = await userModel.findOne({email:email})
        if (existingUser){
           return res.status(201).send({
                success :false,
                message :'User already register please login'
            })
        }
        if(!password && password.length<6){
            return res.send({message:'Password is 6 character long'})
        }

        //password hashed
        const hashedPassword = await hashPassword(password)

        //register user
        const user = await new userModel({
            name:name,
            email:email,
            password:hashedPassword,
            phone:phone,
            address:address,
            answer:answer
        }).save()

        res.status(200).send({
            success:true,
            message:'Registered Successfully',
            user

        })


        
    } catch (error) {
        
        res.status(500).send({
            success : false,
            message :'error in registration',
            error
        })
    }
};

//login
export const loginController = async (req,res)=>{
    try {
        const {email,password} = req.body
        //validation
        if(!email || !password)
        {
           return res.status(404).send({
                success:false,
                message:'invalid email password'
            })
        }
        //user checking
        const user = await userModel.findOne({email:email})
        
        const matchedPassword = await compparePassword(password,user.password)
        if(!matchedPassword){
            return res.status(200).send({
                success:false,
                message:'invalid password'
            })
        }
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d',})
        return res.status(200).send({
            success:true,
            message:`login successfully for user : ${user.email}`,
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                answer:user.answer,
                address:user.address,
                role:user.role
            },token,
        })

    } catch (error) {
       
        res.status(500).send({
            success:false,
            message:'Error in login',
            error
        })
    }
}
//forgotPassword

export const forgotPasswordController = async(req,res)=>{
    try {
        const {email,answer,NewPassword} = req.body
        if(!email){
            res.status(400).send({message:'email is required'})
        }
        if(!answer){
            res.status(400).send({message:'answer is required'})
        }
        if(!NewPassword){
            res.status(400).send({message:'NewPassword is required'})
        }
        
        //find user
        const user = await userModel.findOne({
            email:email,
            answer:answer //first one is collection or model variable name 2nd one getting from input email or answer
        })
        if(!user){
            return res.status(404).send({
                success:false,
                message:'wrong Email or Answer',
            })
        }
        const hashed = await hashPassword(NewPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            success:true,
            message:'password reset successfully'
        })        
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'something went wrong',
            error
        })
    }
}

//updateProfileController
export const updateProfileController =async (req,res)=>{
    try {
        const {name,email,password,address,phone} = req.body
        const user = await userModel.findById(req.user._id)
        //password
        if(password && password.length<6){
            return res.status(404).send({message:'Password is 6 character long'})
        }
        const hashedPassword = password? await hashPassword(password): undefined
        const updateProfileInfo = await userModel.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,

        },{new:true})//new:true object use for update info
        res.status(200).send({
            success:true,
            message:'Profile updated Successfully',
            updateProfileInfo
        }) 
        
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'something went wrong in update profile',
            error
        })
    }
}

// get orders 
export const ordersController =async (req,res)=>{
    try {
        const orders = await orderModel.find({buyer:req.user._id})
        .populate("products","-photo")
        .populate("buyer","name")
        res.json(orders)
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'something went wrong in get orders',
            error
        })
    }
}

//admin all order
export const allOrdersController = async(req,res)=>{
    try {
        const orders = await orderModel.find({}) //its mean return all product
        .populate("products","-photo")
        .populate("buyer","name") //final populate --its use for include the different model data to this model return object
        .sort({createdAt:-1}) //whichs is last insert or created that is show as -1 created
        res.json(orders)
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'something went wrong in get orders',
            error
        })
    }
}
//get all user
export const getAllUserController = async(req,res)=>{
    try {
        const users = await userModel.find({})
        res.json(users)
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'something went wrong in get orders',
            error
        })
    }
}
//order status change admin 
export const orderStatusController =async(req,res)=>{
    try {
        const {orderId} = req.params
        const {status} = req.body
        const order = await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
        res.json(order)
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'something went wrong in get orders',
            error
        })
    }
}