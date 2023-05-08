import slugify from "slugify"
import categoryModel from "../models/categoryModel.js"
import res from "express/lib/response.js"

//add category
export const createCategoryController =async (req,res)=>{
    try {
        const {name}=req.body
        const nameFilter = name.trim() //trim the name which is input by user via json in api 
        if(!nameFilter){
            return res.status(401).send({message:'please provide valid category name'})
        }
        //already exist check
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(201).send({
                success:false,
                message:'category name is already exist please provide different name'
            })
        }
        const category = await new categoryModel({name:nameFilter,slug:slugify(name)}).save()
        res.status(200).send({
            success:true,
            message:'Category created successfully',
            category
        })

    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'something went wrong',
            error
        })
    }
}

//update category
export const updateCategoryController = async(req,res)=>{
    try {
        const {name}= req.body
        const {id} = req.params
        const filtName = name.trim()
        if(!filtName){
            return res.status(401).send({success:false,message:'please enter something'})
        }
        const updateCategory = await categoryModel.findByIdAndUpdate(id,{name:filtName,slug:slugify(filtName)},{new:true})//findByIdAndUpdate(id,updated object,new object) 3 parameter
        res.status(200).send({
            success:true,
            message:'category updated successfully',
            updateCategory
        })
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'something went wrong'
        })
    }
}
//get all category
export const fetchCategoryController =async (req,res)=>{
try {
     const category = await categoryModel.find({}) //find method return all the data object from model collection
     res.status(202).send({
        success:true,
        message:'here is the fetched category list',
        category
     })
} catch (error) {
    
    res.status(500).send({
        success:false,
        message:'something went wrong in fetch all category',
        error
    })
}
}

//single category fetch 
export const getSingleCategoryController =async (req,res) =>{
    try {
        const category = await categoryModel.findOne({slug:req.params.slug})//get slug from the url use req.params.slug as object
        res.status(202).send({
            success:true,
            message:'category get fine',
            category
        })
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'something went wrong in single category fetch',
            error
        })
    }
}


//delete category
export const deleteCategoryController =async (req,res)=>{
    try {
        const {id} = req.params
        const category = await categoryModel.findByIdAndDelete(id) //fine by id and delete
        res.status(200).send({
            success:true,
            message:'category delete successfully'
        })
        
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'something went wrong in delete category'
        })
    }
}