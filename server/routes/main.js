const express=require("express")
const router=express.Router()
const Posts=require("../models/Post")
router.get('',async(req,res)=>{
    try{
const locals ={
    title:"Nodejs blog",
    description:"Simple blog "
}
let perpage=10;
let page=req.query.page||1;
const data=await Posts.aggregate([{$sort:{createdAt:-1}}]).skip(perpage*page-perpage).limit(perpage).exec()
const Count =await Posts.countDocuments()
const nextPage= parseInt(page) +  1;
const hasnextPage=nextPage<=Math.ceil(Count/perpage)

res.render('index',{locals,data,current:page,nextPage:hasnextPage ? nextPage:null,currentRoute:'/'})
}catch(err){
console.log(err)
}

})
// router.get('',async(req,res)=>{
//     const locals ={
//         title:"Nodejs blog",
//         description:"Simple blog "
//     }
//     try{
//     const data=await Posts.find()
//     res.render('index',{locals,data})
//     }catch(err){
//     console.log(err)
//     }
    
//     })
// get post
router.get('/posts/:id',async(req,res)=>{
    try{
const locals ={
    title:"Nodejs blog",
    description:"Simple blog "
}
let slug=req.params.id
const data= await Posts.findById({_id:slug})
res.render('posts',{locals,data,currentRoute:`/post/${slug}`})
}catch(err){
console.log(err)
}

})
//post id
router.post('/search',async(req,res)=>{
    try{
        const locals ={
            title:"Search",
            description:"Simple blog "
        }
        let searchTerm=req.body.searchTerm;
        const searchSpecialChar=searchTerm.replace(/[^a-zA-Z0-9]/g,"")
        const data= await Posts.find({
            $or:[
                {
                    title:{$regex:new RegExp(searchSpecialChar,'i')}
                },
                {
                    body:{$regex:new RegExp(searchSpecialChar,'i')}
                }
            ]
        })
       res.render('search',{
        locals,data
       })
    }catch(err){
        console.log(err)
    }
})
function insertPostsData(){
    Posts.insertMany([
       
        //     { title:"Building a blog",
        //     body:"this is body text"},
        //     {title:"Building APIS",
        //     body:"this is body text"},
        //    {title:"Developing Nodejs",
        //     body:"this is body text"}

     
    ])
}
insertPostsData()
router.get('/about',(req,res)=>{
    res.render('about',{currentRoute:'/about'})
})
module.exports=router