module.exports = (req,res,next) =>{
    if(!req.session.user.isAdmin){
      return res.redirect('/403')
 }
   
 return next()
 
 }