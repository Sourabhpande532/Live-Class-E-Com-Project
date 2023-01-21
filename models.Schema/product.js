import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true, "please provide a product name"],
    trim:true,
    maxLength:[120, "product name should be a max of 100"],
},
price:{
    type:String,
    required:[true, "please provide a product name"],
    maxLength:[5, "product name should not be more than 5 digits"],
},
description:{
    /*Go and Search **Assignment(helps to add description)
      1): npm package to support markdown or
      2): npm package to for editor  */
      type:String
},
photos:[
    {
        secure_url:{
            /*Why This is secrete Url it's a https i.e learn in depth in dashboard your */
            type:String,
            required:true
            
        }
    }
],
stock:{
    type:Number,
    default:0
},
sold:{
    type:Number,
    default:0 
},
/*Goal: each product should have be part of collection/category */
collectionId:{
    type: mongoose.Schema.Types.ObjectId, //for storing _id
    ref: "Collection"
}


},
{
    timestamps:true
})

export default mongoose.model("Product", productSchema)