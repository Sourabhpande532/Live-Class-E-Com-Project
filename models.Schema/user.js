import mongoose from "mongoose";
import Auth from "../utils/auth";
import bcrypt from "bcryptjs";
import  Jwt  from "jsonwebtoken";
import crypto from "crypto"; //It's default Node js Package no need of Install
import config  from "../config";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      maxLength: [20, "Name must be less than 20"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Name is Required"],
      maxLength: [20, "Name must be less than 20"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "password must be at least 8 word"],
      select: false /* when we made querry whenever you make a querry to DB this filed will not come. Ques: how we can match password ,if 
        this password doesn't come with object how we are going to authenticate,how we login late discuss later*/,
    },
    role: {
      type: String,
      // enum: ['ADMIN', "admin"] this one also correct way but not code practice that's why belew
      enum: Object.values(
        Auth
      ) /*it is just a big object that we can stored in an array  The enum validator is an array that will check if the value given is an item in the array. If the value is not in the array, Mongoose will throw a ValidationError when you try to save(). */,
      default: Auth.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
    /*Go and search timestamp in mongoose Mongoose schemas support a timestamps option. If you set timestamps: true, Mongoose will add two properties of type Date to your schema: */
  }
);

// challenge 1- encrypt password  - via mongoose hooks
/*what we befour : we actually work on controller, in the contoller we were extracting everything in req.body, in req.body we extracting the password then password encrypting then adding to our object then object was going to save but ... it also good push on production but due to select:false .... ....
The task is: send the Data into DB. not we have to getting back from DB
Now i am getting the user Data  and send it to Database
To get away from repitation encrypt password ...we have mongoose hooks Go and search in mongoose*/

/*1st: Pre hook=> befoure saving into Database i do cartain task whatever functionality I have to do I do that don't use array function  */

userSchema.pre("save", async function (next) {
  if (!this.modified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/*challenge 2nd: for this=>if(!this.modified("password")) return next()
   whenever user want to update his name then also will run the save might be at that time user not send me password(ll' empty,space)-
 - in that time i've to again updated and encrypt the password it's not good. todo:=> do the task at initially mean's befour modified the name for that use condition
- weather it is firsttime saving or is it some updation is going on i've to put condition if user alreadt exits there it's not a good logic so for that we put above condition
*/

/*challenge 3rd:=>
 add more functionality comparing password,jwt token,or other stuff like to schema go and search mongoose schema methode on stackover-
 * This is not middleware it has full fledges funtionality giving by mongoose Note:prototype lectures  */

 userSchema.methods = {
    /*compare password */
    comparaPassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password)
    },
     /* generate jwt token */
     getJwtToken: function(){
     return Jwt.sign(
        {
            _id: this._id,
            role: this.role
        },
        config.JWT_SECRET,
        {
            expiresIn: config.JWT_EXPIRY
            /*It come from global env(install dotenv) */

        }
     )
     },

    /*generate foragot password token */
    /*ToDo-This token needs to be set up into in Db and user as well send */
    
    generateForgotPasswordToken:function(){
    /*Needs to be generate long string here with crypto simple one 
      then encrypted while saving on DB search on generate a long string with crypto */
    const forgotToken = crypto.randomBytes(20).toString('hex');

    /*step 1: save to DB(encrypted)
      step 2: return values to user */
    
    /*1st step*/
    this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex")

    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000

    /*step 2 : ...- No need time to return it already in DB*/
    return forgotToken
    }
 }
 

 
   





export default mongoose.model("User", userSchema);
// module.exports = mongoose.model("ecommerse", userSchema);
