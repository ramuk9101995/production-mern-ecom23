import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products:[
        {
            type:mongoose.ObjectId,
            ref:"Products" //reference alaways refer the model name  as Products == as mongoose.model('Products',productSchema)
        },
    ],
    payment:{},
    buyer:{
        type:mongoose.ObjectId,
        ref:"users"
    },
    status:{
        type:String,
        default:'Not Process',
        enum:["Not Process","Processing","Shipped","Deliverd","Cancel"],
    },
},
{timestamps:true}
)

export default mongoose.model('Order',orderSchema) //tablename or collection name,Schema