const mongoose=require("mongoose")
const connectdb= async()=>{
    try{
        mongoose.set('strictQuery',false)
        const conn =await mongoose.connect(process.env.MONGODB_URL)
        console.log(`connection successful ${conn.connection.host}`)
    }catch(err){
        console.log(err)
    }
}
module.exports=connectdb