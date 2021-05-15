const mongoose=require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        minlength:5,
    },
    password:{
        type:String,
        required:true,
        minlength:5,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    }

});
//userSchema.plugin(uniqueValidator);
const user=mongoose.model('users',userSchema);
module.exports=user;

