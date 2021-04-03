const path = require('path');

const express = require('express');
const bp = require('body-parser');
const multer = require('multer');
const mongoose=require('mongoose');
const cors = require('cors');
// const errorController = require('./controllers/error');
// const User = require('./models/user');
const session = require('express-session');
const mongoDBStore=require('connect-mongodb-session')(session);
const MONGODB_URI='mongodb+srv://aref76:1nc7MQiVSwrem3je@cluster1.dotoz.mongodb.net/clinicReservation?retryWrites=true&w=majority'
// const csrf=require('csurf');
const flash=require('connect-flash');
// const adminRoutes = require('./routes/admin');
 const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
// const csrfProtection=csrf();
const helmet=require('helmet');

const app = express();
app.use(helmet());

const store=new mongoDBStore({
  uri:MONGODB_URI,
  collection:'sessions'
})
// app.set('view engine', 'ejs');
// app.set('views', 'views');



// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images');
//   },
//   filename: (req, file, cb) => {
//     // console.log(new Date().toString())
//    const FlieUploadingTime=new Date().toString().substr(0,24).split(':').join('-');
//   let extArray = file.mimetype.split("/")[1];

//    const name=file.originalname.split('.')[0]+' '+FlieUploadingTime+'.'+extArray;
//     cb(null,name);
//   }
// });

// const filterFile=(req,file,cb)=>{
//   if(file.mimetype==='image/png'||file.mimetype==='image/jpg'||file.mimetype==='image/jpeg'){
//     cb(null,true);
//   }else{
//    cb(null,false);
//   }
// }

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

// app.use(multer({storage:fileStorage,fileFilter:filterFile}).single('image'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/images',express.static(path.join(__dirname, 'images')));

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.use(
  session({ secret: 'my secret', resave: false, saveUninitialized: false ,store:store})
);
// app.use(csrfProtection);
app.use(flash());




// app.use('/admin', adminRoutes);
app.use(cors())
app.use(userRoutes);
app.use(authRoutes);

// app.get('/500',errorController.get500);
// app.get('/403',errorController.get403);
// app.use(errorController.get404);

// app.use((error,req,res,next)=>{
//   if(error.httpStatusCode==403){
//     return res.redirect('/403')
//   }
// }
// )

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.status;
  const message = err.message;
  const data=err.data;
  res.status(status).json({
      message: message,
      data:data
  })
})

mongoose.connect(MONGODB_URI,
{
  useNewUrlParser:true,
  useUnifiedTopology: true
}).
then(result=>{
  console.log('connected!');
  app.listen(process.env.MONGO_PORT||3000);

}).catch(err=>{
  console.log(err);
});