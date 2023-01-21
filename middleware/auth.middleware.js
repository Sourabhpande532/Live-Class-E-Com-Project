import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/CustomError";
import User from "../models.Schema/user";
import { config } from "dotenv";
import Jwt from "jsonwebtoken";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token;
  /*the region for being we are writing a 
      code than come from many places cookies(objects) */

  if (
    req.cookies.token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))
    /*If the req.header.auther is there go and extract that O.W fail */  
  ) {
    /*upadate process */
    token = req.cookies.token || req.headers.authorization.split(" ")[1];
    /*beacause this is written in a such a way 
      1st thing is bearer and 2nd thigs is Space this split in Array 0th place will be bearer and 1st place is token i.e 1 is mention */

    /* assuming you are reaching here it mean this    token is upadated now */  
  }

  if (!token) {
    throw new CustomError("Not Authorized to access this route", 401);
  }

  /*varify token */

  try {
    const decodedJwtPayload = Jwt.verify(token, config.JWT_SECRET);
    /*if i have a access of this the token is nice go ahead and request it so i accessing this req object and adding field  */
    /* in the payload letjust say at the time of working with payload what did we add it model/userschema see we pass id & role i've to grabbed  _id, find user based on id, set this in req.user
 */
    req.user = await User.findById(decodedJwtPayload._id, "name email role");
    next();
  } catch (error) {
    throw new CustomError("Not Authorized to access this route", 401)
  }
});
