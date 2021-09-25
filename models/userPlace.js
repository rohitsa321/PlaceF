const mongoose=require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');
const Schema=mongoose.Schema;

const userPlaceSchema=new Schema({
     userId:{
         type:String,
     },
     place:[
        {
         location:{
         type:String,
      },
      lat:{
          type:Number,
      },
      lng:{
          type:Number,
      },
      about:{
         type:String,
     },
     image_path:{
         type:String,
         unique:true
     },
     date:{
         type:String,
     }
     }]
 });


const userPlace=mongoose.model('userPlaces',userPlaceSchema);
module.exports=userPlace;



