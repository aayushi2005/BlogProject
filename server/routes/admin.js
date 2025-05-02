const express=require("express")
const router=express.Router()
const Posts=require("../models/Post")
const User=require("../models/User")
const bcrypt=require("bcrypt")
const jwt =require("jsonwebtoken")
const jwtsecret=process.env.jwtsecret
const adminlayout='../views/layouts/admin'
//check login
const autmiddleware=(req,res,next)=>{
    const token =req.cookies.token
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    try{
        const decoded=jwt.verify(token,jwtsecret)
        req.use=decoded.userId
        next()
    }catch(err){
        return res.status(401).json({message:"Unauthorized"})
    }
    }
// get home
router.get('/admin',async(req,res)=>{
    try{
        const locals ={
            title:"Admin Panel",
            description:"Simple blog "
        }
        res.render('admin/index',{locals,layout:adminlayout})
    }catch(err){
        console.log(err)
    }
})
// admin check login
router.post('/admin',async(req,res)=>{
    try{
      const {username,password}=req.body;
     const user =await User.findOne({username})
     if(!user){
        return res.status(401).json({message:"Invalid credentials"})
     }
     const isPasswordValid =await bcrypt.compare(password,user.password)
     if(!isPasswordValid){
        return res.status(401).json({message:"Invalid credentials"})
     }
     const token =jwt.sign({userId:user._id},jwtsecret)
     res.cookie('token',token,{httpOnly:true})
     res.redirect('/dashboard');
    }catch(err){
        console.log(err)
    }
})

//dashboard
router.get('/dashboard',autmiddleware,async(req,res)=>{
    try{
        const locals ={
            title:"DashBoard",
            description:"Simple blog "
        }
const data=await Posts.find()
res.render('admin/dashboard',{
    locals,
    data,
    layout:adminlayout
})
    }catch(err){
 console.log(err)
    }
})
// router.post('/admin',async(req,res)=>{
//     try{
//       const {username,password}=req.body;
//      if(req.body.username==='admin' && req.body.password==='password'){
//         res.send("You're logged in")
//      }
//      else{
//         res.send("wrong username or password")
//      }
//     }catch(err){
//         console.log(err)
//     }
// })
//posr register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Received request with username:", username); // Debugging input

        // Validate the input
        if (!username || !password) {
            console.log("Validation failed - Missing username or password"); // Debugging validation
           return res.status(400).json({ message: "Username and password are required" });
        }

        // Hash the password
        const hashpassword = await bcrypt.hash(password, 10);
        console.log("Password hashed successfully"); // Debugging hashing

        // Create the user
        try {
            const user = await User.create({ username, password: hashpassword });
            console.log("User created successfully:", user); // Debugging user creation
           res.render('admin')
        } catch (err) {
            if (err.code === 11000) { // Duplicate key error
                console.log("Duplicate username error:", err); // Debugging duplicate error
                return res.status(409).json({ message: "Username already in use" });
            }
            console.error("Error creating user:", err); // Logging detailed error
            return res.status(500).json({ message: "Internal server error" });
        }
    } catch (err) {
        console.error("Unexpected error:", err); // Logging unexpected error
        return res.status(500).json({ message: "Internal server error" });
    }
});
// create new post
router.get('/add-post',autmiddleware,async(req,res)=>{
    try{
        const locals ={
            title:"Add post",
            description:"Simple blog "
        }
        const data= await Posts.find()
        res.render('admin/add-post',{
            locals,
            data,
            layout:adminlayout
        })
    }catch(err){
console.log(err)
    }
})
//create new post
router.post('/add-post',autmiddleware,async(req,res)=>{
    try{
const newpost = new Posts({
 title:req.body.title,
 body:req.body.body
});
await Posts.create(newpost)
    res.redirect('dashboard')
    }catch(err){
console.log(err)
    }
})
// get edit
router.get('/edit-post/:id',autmiddleware,async(req,res)=>{
    try{
        const locals ={
            title:"Edit post",
            description:"Simple blog "
        }
       const data=await Posts.findOne({_id:req.params.id})
       res.render('admin/edit-post',{
        locals,
        data,
        layout:adminlayout
       })
    }catch(err){
console.log(err)
    }
})
//put
router.put('/edit-post/:id',autmiddleware,async(req,res)=>{
    try{
      await Posts.findByIdAndUpdate(req.params.id,{
        title:req.body.title,
        body:req.body.body,
        updatedAt:Date.now()
      })
       res.redirect(`/edit-post/${req.params.id}`)
    }catch(err){
console.log(err)
    }
})
router.delete('/delete-post/:id',autmiddleware,async(req,res)=>{
    try{
await Posts.deleteOne({_id:req.params.id})
res.redirect('/dashboard')
    }catch(err){
        console.log(err)
    }
})
router.get('/logout',async(req,res)=>{
    try{
   res.clearCookie('token')
//    res.json({message:'Logout succeessful'})
   res.redirect('/')
    }catch(err){
        console.log(err)
    }
})
router.get('/posts/:id',async(req,res)=>{
    try{
    const data=    await Posts.findById({_id:req.params.id})
   res.render('posts',data)
    }catch(err){
        console.log(err)
    }
})
module.exports=router
