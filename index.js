import mongoose from "mongoose";
import config  from "./config/index";
const app = require("./app");

/*Data Base connection it's better place
  As soon as this run I wat to connect this to database
  step:=> 1) create a fn
          2) run a fn   
          3) iffy=>: means what (if you want to create function and immiditaly want to run it)
             syntax: easy=> (async () =>{})() */

(async () =>{
    try {
      await mongoose.connect(config.MONGODB_URL)
      console.log("DB CONNECTED");  
      /*You need to explore express events listners go on express docs */
      app.on("error", (err)=>{
        console.log("ERROR", error);
        throw error
      })
      const onListning = ()=>{
        console.log(`Listening on ${config.PORT}`)
      }

      app.listen(config.PORT, onListning)
      
    //   app.listen(config.PORT, ()=>{
    //     console.log(`Listening on ${config.PORT}`)
    //   })
    } catch (error) {
        console.log("ERROR", error);
        throw error
    }  
})()             






