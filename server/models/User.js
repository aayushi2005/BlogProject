const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const userschema= new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    title: {
        type: String,
        required: false // Make this field optional
    }
})
module.exports=mongoose.model('User' ,userschema)