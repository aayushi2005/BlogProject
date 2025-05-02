require('dotenv').config();
const express= require("express")
const expresslayout =require("express-ejs-layouts")
const methodoverwrite=require("method-override")
const cookieParser=require("cookie-parser")
const MongoStore= require("connect-mongo")
const connectdb=require("./server/config/db");
const  {isActiveRoute}=require("./server/helpers/route-helpers")
const session = require('express-session');
const app=express()
const port = 9001||process.env.port
connectdb()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(methodoverwrite('_method'))
app.use(session({
    secret:"keyboard cat",
    resave:false,
    saveUninitialized:true,
    store:MongoStore.create({
        mongoUrl:process.env.MONGODB_URL
    }),
    
}))
app.use(expresslayout)
app.use(express.static('public'))
app.set('layout','./layouts/main')
app.set('view engine','ejs')
app.locals.isActiveRoute=isActiveRoute;
app.use('/',require('./server/routes/main'))
app.use('/',require('./server/routes/admin'))
app.listen(port,()=>{
    console.log(`listening at port ${port}`)
})