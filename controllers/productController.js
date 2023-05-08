import productModel from "../models/productModel.js"
import slugify from "slugify";
//fs for media file
import fs from 'fs'
import categoryModel from "../models/categoryModel.js"
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv"

dotenv.config()


//braintree gateway 
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

//add product
export const createProductController = async (req,res)=>{
    try {
        const {name,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;
        switch (true) {
            case !name:
                return res.status(500).send({message:'product name is required'})
            case !description:
                return res.status(500).send({message:'product description is required'})
            case !price:
                return res.status(500).send({message:'product price is required'})
            case !category:
                return res.status(500).send({message:'product category is required'})
            case !quantity:
                return res.status(500).send({message:'product quantity is required'})
            
        }
        const products = new productModel({...req.fields,slug:slugify(name)}) //sprade the fileds or break the fileds use ... and object 
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        } 
        await products.save()
        res.status(201).send({
            success:true,
            message:'product add successfully',
            products
        })
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'something went wrong in create product',
            error
        })
    }
}

export const getProductController = async (req,res)=>{
    try {
        const products = await productModel
            .find({})
            .populate('category')
            .select("-photo")
            .limit(12)
            .sort({createdAt:-1})//initial time no need of photo thats why use -photo with filter
        res.status(200).send({
            success:true,
            total_count:products.length,
            message:'here is the products',
            products
        })
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'something went wrong in fetch product'
        })
    }
}

export const getPhotoController =async (req,res)=>{
    try {
        
        const products = await productModel.findById(req.params.pid).select("photo")
        if(products.photo.data)//check the products object having the photo and data on it 
        {
            res.set('content-type',products.photo.contentType)
            res.status(201).send(products.photo.data)
        }
        else{
            res.status(210).send({
                message:`no photo in ${products.id}`
            })
        }

    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'someting went wrong in get the product photo',
            error
        })
    }
}
export const getSingleProdCrontroller =async (req,res)=>{
    try {//:after colon name is same as the req.params.colon as this case req.params.slug from the route file  as'/get-singleprod/:slug'
        const singleProduct = await productModel.findOne({ slug : req.params.slug }).select("-photo").populate("category")//populate use for conversion of id to string name
        if(singleProduct){
            res.status(200).send({
                success:true,
                message:'here is the product',
                singleProduct       
            })
        }else{
            console.log(singleProduct)
        }
        
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'something went wrong in get single product'
        })
    }
}

//update
export const updateProductController=async(req,res)=>{
    try {
        const {name,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;
        switch (true) {
            case !name:
                return res.status(500).send({message:'product name is required'})
            case !description:
                return res.status(500).send({message:'product description is required'})
            case !price:
                return res.status(500).send({message:'product price is required'})
            case !category:
                return res.status(500).send({message:'product category is required'})
            case !quantity:
                return res.status(500).send({message:'product quantity is required'})
            
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {...req.fields,slug:slugify(name)},{new:true}
            ) //sprade the fileds or break the fileds use ... and object  //new for update on existing
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        } 
        await products.save()
        res.status(201).send({
            success:true,
            message:'product Update successfully',
            products
        })
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'something went wrong in update product',
            error
        })
    }
}
export const deleteProductController =async (req,res)=>{
    try {
        const product = await productModel.findByIdAndDelete(req.params.pid)
        res.status(203).send({
            success:true,
            message:'product deleted successfully'
        })
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'something went wrong in delete product',
            error
        })
    }
}
export const filterProductController = async(req,res)=>{
    try {
        const {checked,radio} = req.body
        let args = {}
        if(checked.length>0) args.category = checked
        if(radio.length)args.price = {$gte:radio[0],$lte:radio[1]}
        const products = await productModel.find(args)
        res.status(210).send({
            success:true,
            message:"here is the filtered product resualts",
            products
        })
    } catch (error) {
        
        res.status(501).send({
            success:false,
            message:'something went wrong'
        })
    }
}

////product count
export const productCountController = async(req,res)=>{
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(201).send({
            success:true,
            total
        })

    } catch (error) {
        
        res.status(501).send({
            success:false,
            error,
            message:'something went wrong'
        })
    }
}


//product per page
export const productListController =async(req,res)=>{
    try {
        let perPage =3
        let page = req.params.page ? req.params.page:1
        const products = await productModel.find({})
                        .select('-photo')
                        .skip((page-1)*perPage)
                        .limit(perPage)
                        .sort({createdAt:-1})
        res.status(201).send({
            success:true,
            products
        })

    } catch (error) {
        res.status(501).send({
            success:false,
            error,
            message:'something went wrong'
        })
    }
}
//search product
export const productSearchController =async (req,res)=>{
    try {
        const {keyword} = req.params
        const results = await productModel.find({
            $or:[
                {name:{$regex :keyword,$options:"i"}},//i for case insensetive
                {description:{$regex :keyword,$options:"i"}}//check both name and description for similer word via keyword
            ]
        }).select("-photo")
        res.json(results)
    } catch (error) {
        
        res.status(404).send({
            success:false,
            message:'something went wrong in search api'
        })
    }
}

//related product in detials page
export const relatedProductController =async (req,res)=>{
    try {
        const {pid,cid}= req.params
        const products = await productModel.find({
            category:cid,
            _id:{$ne:pid} //$ne is function means not included
        }).select("-photo").limit(4).populate("category")
        res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        
        res.status(404).send({
            success:false,
            message:'something went wrong in similer product api'
        })
    }
}

//category wise product return 
export const categoryWiseProductController =async (req,res)=>{
    try {
        
        const category = await categoryModel.findOne({slug:req.params.slug}) //pass the slug from url params directly comppare with slug filed
        const products = await productModel.find({category}).populate("category") //populate use for return the object of that id filed into the different collection or table
        res.status(200).send({
            success:true,
            category,
            products
        })
    } catch (error) {
        
        res.status(404).send({
            success:false,
            message:'something went wrong in categoryWiseProductController api'
        })
    }
}
//braintree
export const brainTreeTokenController = async(req,res)=>{
    try {
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err)
            }
            else{
                res.send(response)
            }
        })
    } catch (error) {
        
    }
}
// braintree payment
export const braintreePaymentController = async(req,res)=>{
    try {
        const {cart,nonce} = req.body
        let total =0
        cart.map((i)=>{
            total +=i.price
        })
        let newTransaction = gateway.transaction.sale({
            amount:total,
            paymentMethodNonce: nonce,
            options:{
                submitForSettlement:true
            }
        },
        function(error,result){
            if(result){
                const order = new orderModel({
                    products:cart,
                    payment:result,
                    buyer:req.user._id
                }).save()
                res.json({ok:true})
            }
            else{
                res.status(500).send(error)
            }
        }
        
        )
    } catch (error) {
        
    }
}