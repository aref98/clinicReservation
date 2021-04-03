const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
 
 userId:{
   type:Object,
   required:true
 },
 userUsername:{
    type:String,
    required:true
 },
 doctorId:{
   type:Object,
   required:true
 },
 doctorUsername:{
    type:String,
    required:true
 },
 appointment:{
   type:String,
   required:true
 },
 status:{
   type:String,
   required:false,

 }
});


module.exports=mongoose.model('Reservation',userSchema);

