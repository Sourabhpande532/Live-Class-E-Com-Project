import { options, use } from "../config/traspotar.Schema";
import User from "../models.Schema/user";
import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/CustomError";
import mailHelper from "../utils/mailHelper"
import crypto from "crypto";
import user from "../models.Schema/user";

export const cookieOption = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  //could be in a separate file in utils
};

/***********************************
 * @SIGNUP
 * @route http://localhost:5000/api/auth/signup
 * @description User signup controller for creating new user
 * @parameter name,email,password
 * @returns User Object
 *
 ***********************************/

// why we use async 2 times because it's for good practice in his file it could be ignore

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomError(`please fill all fields`, 400);
  }
  /*cheack if user exists */
  const exitOrNot = await User.findOne({ email });

  if (exitOrNot) {
    throw new CustomError(`User already exits`, 400);
  }
  const user = await User.create({
    name,
    email,
    password,
  });

  //create Token
  // const Token = User.getJwtToken || user.getJwtToken
  // which one you choose tell and why? go models first and check user because:: we already create methode(for action)
  //for userSchema in model & here we again created object so for performing action we need this object user

  const token = user.getJwtToken();
  console.log(
    user
  ); /*here password show what is use of select: false see belew in userSchema*/
  /*there is two scenario came into picture querry to To && creating a object/document for DB
      @whenever you created document for mongoDB it is as it is bact return to you name,email,password-
      @whenever you next time visited mens querry(already exits user) to DB that time select false came into picture and becomes true
    */
  user.password = undefined;

  res.cookie("token", token, cookieOption);
  res.status(200).json({
    success: true,
    token,
    user,
  });
});

/***********************************
 * @LOGIN
 * @route http://localhost:5000/api/auth/login
 * @description User signup controller for loging new user
 * @parameter email,password
 * @returns User Object
 *
 ***********************************/

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError("please fill all fields", 400);
  }
  const user = await User.findOne({ email }).select("+password"); // with understanding of document can we say if i don't want to send -name, or anything recomandation of fronted one use -d use minus
  // write now we have one it could be many here so go mongoose docs and see select

  if (!user) {
    throw new CustomError("Invalid Credentials", 400);
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (isPasswordMatch) {
    const token = user.getJwtToken();
    user.password = undefined;
    res.cookie("token", token, cookieOption);
    return res.status(200).json({
      success: true,
      token,
      user,
    });
  }
  throw new CustomError("Invalid credentials", 400);
});

/***********************************
 * @LOGOUT
 * @route http://localhost:5000/api/auth/logout
 * @description User logout by clearig user cookies
 * @parameter
 * @returns User Object
 *
 ***********************************/

export const logout = asyncHandler(async (_req, res) => {
  // res.clearCookie() why _req because no use this

  /*why null=> in login route i was created one token and 
    give a name "token",token(value) in cookieOption 85 line here i change the scenario  */
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

/***********************************
 * @FORGOT_PASSWORD
 * @search go and search google hot to send mail in node js cheack nodemailer
 * @visit files: config/transpotar.schema then .env then utils/mailHelper then 
 * @route http://localhost:5000/api/auth/password/forgot
 * @description: user will submit email and we will generate a token
 * @parameter email
 * @returns success message - email send
 * @Install package npm i nodemailer
 ***********************************/

export const forgotPassword = asyncHandler(async(req,res)=>{
const {email} = req.body
//cheack email for null or ""
const user = await User.findOne({email});
if(!user){
    throw new CustomError("User not found", 404)
}
/*go and explore models.Schema/user you will find 
generateForgotPasswordToken-what-will-do => this will generate token, will stored it into DB and as a return value as a token as well */

const resetToken = user.generateForgotPasswordToken();

/*This is not being saved in the DB uptill now save it first*/
//user.save() if you save like this it'll create problem
// because by doing this it will stored all validation that you made in models.schema
// we don't want like this here so for that 👇

await user.save({validateBefourSave: false})

/*Now we are sendbuser & email this is the URL(resetToken vala)
  & this is where you are grabbed 👇 */
  /*Moto: in this case i'm not resetting password The goal is 
    just make sure just pass URL to user & later on when i'll 
    reseting the password i will grabbed this token from the user URL the goal is create URL */

/*Go And Search express docs and click on request left corners
  based on condition we've to change this URL at the time of hoisting
  it becomes http => https   */

  // const resetUrl=`http://xyzanyWebsiteMentionHere.com`
 
  const resetUrl = `${req.protocol}://${req.get("host")}/api/password/reset/${resetToken} `

  const text = ` Your password reset url is \n\n ${resetUrl}\n\n`
  try {
    await mailHelper({
      /*we've to pass some options(It's big object  nothing much) we're grabbing all things from DB*/
      email: user.email,
      subject: "password reset email for website",
      text: text,
    })
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email}`
    })
  } catch (error) {
    //roll back - clear fields and save
    /**
     * @note: we we call const resetToken = user.generateForgotPasswordToken(); in line no. 144 two new database field were updated now user has entry in this fields & email was not to send to him 
     */
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save({validateBefourSave: false})

    throw new CustomError(err.message || 'Email sent failure', 500)
  }


})

/***********************************
 * @RESET_PASSWORD
 * @route http://localhost:5000/api/auth/password/reset/   :resetPasswordToken
 * note:when we design a forgotPassword we pass resetUrl and reset token-
 * -this is token we want this is the same token we already stored in db  we need to match this one that is why this is too important
 * @description User will be able to reset password base on url token
 * @parameter token from url, password and confirmed password
 * @returns success message - User object
 *
 ***********************************/


export const resetPassword = asyncHandler(async(req,res)=>{
  const {token: resetToken} = req.params;
  const {password, confirmPassword} = req.body;
   
  /*Note: whatever token we stored into DB it encrypted  one explore models/user see gnrFortTokn in order to match it i also convert token either encrypt or decrypt ... decrypt is hard due(using sh256) so encrypt one */
  
 const resetPasswordToken =  crypto
  .createHash('sha256')
  .update(resetToken)
  .digest('hex')

  /*!! Now I have value which is in my DB and i have value    which is given by User;
  How we were able to find a user when somebuddy give me email(findone) same step is here i have field resetPasswordToken i want to find user based on a field resetPasswordToken can i find him what would be the methode i using same findOne
  @note: previously we find user via email in DB now we've to find user which is different property which is Token DB is only for finding */

  /*This is Exactly same 
  User.findOne({email: email}) Due to js clever we use only one time*/

  const user = await User.findOne({
    forgotPasswordToken: resetPasswordToken,
    forgotPasswordExpiry:{$gt: Date.now()}
    /* Now this expirey will return me user which matches both property both should be true the token should be there but Date should be greter than now 
    You can pass more than property here */
    
    /*model/user if see, forPasstokn we set 20 min in the future now here we are in future and the future we are checking wheather this field has a value which is greter than at least now... if date is set in past do'nt do it mean token is expire */

    /*this above field return me a data if both are true 1st it is cheack the token is matching or not if he doesn't find i did'nt find the user if he find it will say date field of that xyz user should be greter than now  */

  })
  if(!user){
    throw new CustomError('password token is invalid or expired',400)  
  }

  if(password !== confirmPassword){
    throw new CustomError('Not Match', 400)
  }
  /*Upadate it */
  user.password = password;
  /*No need to save this garbage into DB i.e */
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  /*The question came: why we not encrypted password The ans in Schema see userschema.pre */

  await user.save();

  //create token and send as a response
  const token = user.getJwtToken();
  user.password = undefined;
  
  //helper methode for cookie can be added
  res.cookie("token", token, cookieOption)
  res.status(200).json({
    success: true,
     user
  })
  
} )

//ToDo Create a controller for change password



/***********************************
 * @GET_PROFILE
 * @REQUEST_TYPE GET
 * @route http://localhost:5000/api/auth/profile
 * @description check for token and populate req.user
 * @parameter name, email, password
 * @returns- User object
 *
 ***********************************/

export const getProfile = asyncHandler(async(req,res)=>{
  const {user} = req
  if(!user){
    throw new CustomError("user not found", 404)
  }
  res.status(200).json({
    success: true, 
    user
  })
})
