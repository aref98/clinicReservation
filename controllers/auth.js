const User = require('../models/user');
const crypto=require('crypto');
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
const jwt = require('jsonwebtoken');

const {validationResult}=require('express-validator');

const sparkPostTransport =require('nodemailer-sparkpost-transport');


// const sendgridTransport=require('nodemailer-sendgrid-transport');
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
      user: 'atb.1394@gmail.com',
      pass: 'v for mafia'
  }
});

exports.getLogin = (req, res, next) => {
  let message=req.flash('error');
       message= message.length>0 ?message[0]:null;
        res.render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage:message,
          oldInput:{
            email:'',
            password:''
          },
          validationErrors:[]
        });

        };

        exports.login = async (req, res, next) => {
          const email = req.body.email;
          const password = req.body.password;
          try {
              const user = await User.findOne({ email: email })
              const isEqual = await bcrypt.compare(password, user.password);
              if (!user) {
                  const error = new Error('کاربر با این ایمیل یافت نشد');
                  error.status = 401;
                  throw error;
              }
              if (!isEqual) {
                  const error = new Error('رمز عبور صحیح نمی باشد');
                  error.status = 401;
                  throw error;
              }
              const token = jwt.sign(
                  {
                      email: user.email,
                      userId: user._id.toString()
                  },
                  'no one should know this!!',
                  { expiresIn: '10h' }
              );
              req.session.isLoggedIn= true;
              req.session.user = token;
              return req.session.save(err=>{
                res.status(200).json({
                  token: token,
                  userId: user._id.toString(),
                  message:'no one should know this! be carefull! :)'
              });
              })
            
          }
          catch (err) {
              err.status ? err.status : 500;
              next(err);
          }
      
      }
          
exports.postLogout = (req, res, next) => {
  req.session.destroy(err=>{
    // console.log(err);
    res.redirect('/');

  })
}
exports.postSignup=(req,res,next)=>{
  console.log(req.body.email)
  const email=req.body.email;

  const password=req.body.password;
  const username=req.body.username;
  const gender=req.body.gender;
  const age=req.body.age;
  const role=req.body.role;
 
  const errors=validationResult(req);
  // console.log(errors.array());
  if(!errors.isEmpty()){
      return res.status(422).json({
     
        errorMessage:errors.array(),
        oldInput:{email:email,password:password,confirmPassword:req.body.confirmPassword},
        validationErrors:errors.array()
      })
    // return res.status(422).render('auth/signup',{
    //   path: '/signup',
    //   pageTitle: 'signup',
    //   errorMessage:errors.array(),
    //   oldInput:{email:email,password:password,confirmPassword:req.body.confirmPassword},
    //   validationErrors:errors.array()
    // });
  }
  
     bcrypt.hash(password,12)
     .then(hashedPassword=>{
       const user=new User({
         email:email,
         password:hashedPassword,
         username:username,
         gender:gender,
         age:age,
         role:role,
         timeReserved:{
           items:[]
          }
        });

        return user.save()
      }).then(result=>{
        // res.redirect('/login'); 
        res.json({
          status: 200,
          message:'user account has been created successfully!'
        })
        return transporter.sendMail({
          from: 'atb.1394@gmail.com',
          to: email,
          subject: 'حساب شما با موفقیت ساخته شد',
          html: 'خیلی خوش آمدید. حساب کاربری شما با موفقیت ساخته شد!'
        }).then(result=>{
             console.log(result);
        }).catch(err=>{
          console.log(err);
        
        });
     
      
   
   })
   .catch(err=>{
     console.log(err)
     const error=new Error(err);
     error.httpStatusCode=500;
     error.message='خطا هنگام ثبت ثبت نام';
     console.log(error.message);
     return next(error);
   })
}
exports.getSignup = (req, res, next) => {
  let message=req.flash('error');
  message= message.length>0 ? message[0]:null;
res.render('auth/signup',{
  path: '/signup',
  pageTitle: 'Signup',
  errorMessage:message,
  oldInput:{email:'',password:'',confirmPassword:''},
  validationErrors:[]

});
}
exports.getReset= (req,res,next) => {
  let message=req.flash('error');
  message= message.length>0 ?message[0]:null;
   res.render('auth/reset', {
     path: '/reset',
     pageTitle: 'Forget Password',
     errorMessage:message,
     message:'',

   });

};
exports.postReset=(req,res,next)=>{
email=req.body.email;
crypto.randomBytes(32,(err,Buffer)=>{
  if(err){
    console.log(err);
    req.flash('error','مشکلی پیش آمده دوباره درخواست بدهید')
    return res.redirect('/reset');
  }
  
  const token=Buffer.toString('hex');
  User.findOne({email:email})
  .then(user=>{
    if(!user){
      req.flash('error','!کاربری با این ایمیل یافت نشد');
      return res.redirect('/reset');
    }
    user.resetToken=token;
    user.resetTokenExpiration=Date.now()+3600000;
    return user.save()
    .then(result=>{
      res.render('auth/reset',{
        message:'یک ایمل فعال سازی برای شما ارسال شد',
        path:'/reset',
        errorMessage:'',

      });
      return transporter.sendMail({
        from: 'atb.1394@gmail.com',
        to: email,
        subject: 'درخواست تغییر رمز عبور',
        html: `
        <h1>اگر این درخواست توسط شما داده نشده است لطفا این ایمیل را نادیده بگیرید</h1>
        <p>برای تغییر رمز عبور لطفا لینک زیر را کلیک را کنید</p>
       <a href="http://localhost:3000/reset/${token}">تغییر رمز عبور</a>
       `
  
      }).then(result=>{
           console.log(result);
      }).catch(err=>{
        console.log(err);
        
      });
   
  
    })
  })
  .catch(err=>{
    console.log(err);
    const error=new Error(err);
    error.httpStatusCode=500;
    error.message='خطا هنگام ثبت ریست کردن پسورد';
    console.log(error.message);
    return next(error);  })
  .catch(err=>{
    console.log(err);
  })
})
};

exports.getNewPassword=(req,res,next)=>{
  token=req.params.token;
  User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
  .then(user=>{
    if(!user){
      req.flash('error','درخواست شما دیگر معتبر نیست لطفا دوباره درخواست دهید')
      return res.redirect('/reset');
    }
    let message=req.flash('error');
   message= message.length>0 ?message[0]:null;
   res.render('auth/new-password', {
    path: '/new-password',
    pageTitle: 'تغییر رمز عبور',
    errorMessage:message,
    userId:user._id.toString(),
    passwordToken:token
  });
 })
  .catch(err=>{
    console.log(err);
  })
};

exports.postNewPassword=(req,res,next)=>{
   const userId=req.body.userId;
   const passwordToken=req.body.passwordToken;
   const newPassword=req.body.newPassword;

   User.findOne({
     _id:userId,
    resetToken:passwordToken,
    resetTokenExpiration:{$gt:Date.now()}}) 
   .then(user=>{
     if(!user){
      req.flash('error','درخواست شما دیگر معتبر نیست لطفا دوباره درخواست دهید')
      return res.redirect('/reset');
     }
     return bcrypt.hash(newPassword,12)
     .then(hashedPassword=>{
       user.password=hashedPassword;
       user.resetToken=undefined;
       user.resetTokenExpiration=undefined;
       return user.save();
     }).then(result=>{
      res.redirect('/login');
     })
     .catch(err=>{
      console.log(err);
      const error=new Error(err);
      error.httpStatusCode=500;
      error.message='خطا هنگام ثبت پسورد جدید';
      console.log(error.message);
      return next(error);    
      })
     .catch(err=>{
       console.log(err);
       req.flash('error','متاسفانه مشکلی رخداده است لطفا دوباره درخواست دهید')
       return res.redirect('/reset');

     })
   })
   .catch(err=>{
     console.log(err);
   })
}
 
