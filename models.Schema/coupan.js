import mongoose from "mongoose";

const coupanSchema = new mongoose.Schema({
    code:{
        type: String,
        required: [true, "please provide a coupan code"]
    },
    discount:{
        type: Number,
        default:0
    },
    active:{
        type: Boolean,
        default:true
        /*why true: if you created coupan and it does'nt work in that way */
    }
},
{
    timestamps: true
}
)

export default mongoose.model("Coupan", coupanSchema);