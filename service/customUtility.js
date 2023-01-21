/* go and search about that
Next vision I am going to go ahead handle bunch of error
  so go ahead & create file in sevice */

/*What Learn: here we learn memory */

/*in order to understand more 
  error class in javascript develloper mozila see constructor error*/
class CustomError extends Error{
constructor(message, code){
    super(message);
    this.code = code;
}
}
export default CustomError; 