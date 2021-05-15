const mongoose=require("mongoose");

const connectDB= async()=>{
  try{
    const conn=await mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false,
        useCreateIndex:true
    })
    console.log("Db connected: "+conn.connection.host);
  }catch(err){
      console.log("ERROR: "+err);
  }
}
module.exports=connectDB;