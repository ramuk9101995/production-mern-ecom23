import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:mongoose.ObjectId, //id from monngose genarated id
        ref:"Category",
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    photo:{
        data:Buffer, //npm i express-formidable add this package for upload image
        contentType: String
       
    },
    shipping:{
        type:Boolean
    }
},
{timestamps:true} //for insert current time in collection automatically
)

export default mongoose.model('Products',productSchema)//first parameter is collection name as string and 2nd one is function of schema
