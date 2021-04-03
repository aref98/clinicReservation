const jwt=require('jsonwebtoken');


module.exports=(req,res,next)=>{
    const authToken=req.get('Authorization');
    if(!authToken){
        const error=new Error('not authenticated');
        error.status=401;
        throw error;  
      }
    const token=authToken.split(' ')[1];

    let decodedToken;
    try{
     decodedToken=jwt.verify(token,'no one should know this!!')
    }catch(err){
      err.status=500;
      throw err;
    }
    if(!decodedToken){
        const error=new Error('not authenticated');
        error.status=401;
        throw error;
    }
    req.userId=decodedToken.userId;
    next();
};