const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
 
 email:{
   type:String,
   required:true
 },
 name:{
   type:String,
   required:true
 },
 username:{
   type:String,
   required:true
 },
 medicalSerialNumber:{
    type:String,
    required:true
 },
 educationalDegree:{
    type:String,
    required:true
 },
 specialty:{
    type:String,
    required:true
 },
 timeTable:{
   type:Array,
   required:false

 },
 password:{
   type:String,
   required:true
 },
 role:{
   type:String,
   required:true
 },
 city:{
   type:String,
   required:true
 },
 age:{
   type:String,
   required:true
 },
 gender:{
   type:String,
   required:true
 },
 phoneNumber:{
   type:String,
   required:true
 },
 resetToken:String,
 resetTokenExpiration:Date,
 timeReserved:{
   items:[ {reserveId: {type:Schema.Types.ObjectId,ref:'Reservation' , require:false}}]
 }
});

userSchema.methods.addTotimeReserved=function(product){
  const timeReservedProductIndex = this.timeReserved.items.findIndex(cp => {
          return cp.reserveId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedtimeReservedItems = [...this.timeReserved.items];
    
        if (timeReservedProductIndex >= 0) {
          newQuantity = this.timeReserved.items[timeReservedProductIndex].quantity + 1;
          updatedtimeReservedItems[timeReservedProductIndex].quantity = newQuantity;
        } else {
          updatedtimeReservedItems.push({
            reserveId: product._id,
            quantity: newQuantity
          });
        }
        const updatedtimeReserved = {
          items: updatedtimeReservedItems
        };
      this.timeReserved=updatedtimeReserved;
        return this.save();
}

userSchema.methods.decreaseFromtimeReserved=function(reserveId){
  const updatedtimeReservedItems=this.timeReserved.items.filter(item=>{
    if(item.quantity==0){
          return item.reserveId.toString()!== reserveId.toString();
    }else
       return item.quantity=item.quantity-1;
        });
        this.timeReserved.items=updatedtimeReservedItems;
        return this.save();
};
userSchema.methods.removeFromtimeReserved=function(reserveId){
  const updatedtimeReservedItems=this.timeReserved.items.filter(item=>{
          return item.reserveId.toString()!== reserveId.toString();
        });
        this.timeReserved.items=updatedtimeReservedItems;
        return this.save();
};
userSchema.methods.getOrders=function(userId){
 
 return Order.find({'user.userId':userId});

}
module.exports=mongoose.model('Doctor',userSchema);

