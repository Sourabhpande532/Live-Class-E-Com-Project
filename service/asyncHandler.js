/*This is simelar to closer, HOF Must explore */
const asynHandler = (fn) => async(req,res,next)=>{ //this is not middleware it just simply parameters
    try {
       await fn(req,res,next) //watch closer video of hitesh
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }

}

export default asynHandler;
/*Next vision I am going to go ahead handle bunch of error
  so go ahead & create file in sevice */

/*Why this is all one To make our life so much easier 
  in the controller */

/**
 const asyncHandler = () =>{} Normal One
 const asyncHandler = (func)=>{}
 const asyncHandler = (func)=>()=>{}
 const asyncHandler = (func)=>async()=>{}
 */

 
 /** 2nd way of doing
  function asyncHandlers(fn){
    return async function(req,res,next){
        try {
            await fn(req,res,next)
        } catch (error) {
          res.status(error.code || 500).json({
            success: false,
            message: error.message
          })  
        }
    }
}
  */