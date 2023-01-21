import mongoose  from "mongoose";

const userCollectionSchema = mongoose.Schema({
name:{
    type:String,
    trim: true,
    required:[true, "please provide a Catagory name"],
    maxLength:[120, "it Should'nd be more than 120 line"]
}
},
{
    timestamps: true
}
)

export default mongoose.model("Collection", userCollectionSchema)