import express from 'express'
import mongoose from 'mongoose';
import { User } from './Models/user.js';
import multer from 'multer';
import path from 'path'
const app=express();
app.use(express.urlencoded({extended:true}));
//Middleware to store the files in the storage disk
const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: function (req, file, cb) {
      
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })

mongoose.connect("mongodb://localhost:27017/nodejs_express_api_series").then(()=>{
    console.log("Mongo db connected");
}).catch((error)=>{console.log(error)});

import { v2 as cloudinary } from 'cloudinary';
// Configuration
cloudinary.config({ 
    cloud_name: 'dsdwkst1m', 
    api_key: '496639793474817', 
    api_secret: 'jGYRrry_vP6il7S24-Re7pvtPFI' // Click 'View API Keys' above to copy your API secret
});

app.get('/register',(req,res)=>{
    res.render('Register.ejs');
})

app.post('/register',upload.single('file'), async(req,res)=>{
    const file=req.file.path
    const{name,email,password}=req.body;  
    
    try{
        const cloudinaryRes=await cloudinary.uploader.upload(file,{
            folder:'FullStackAuthentication'
        });
        let user=await User.create({
            profileImg:cloudinaryRes.secure_url,
            name,email,password
        })
        res.redirect('/login');
        console.log(cloudinaryRes,name,email,password);

    }
    catch(error){
        res.send("Error Occured");
    }

})

app.post('/login',async (req,res)=>{
    const {email,password}= req.body;
    try{
        let user=await User.findOne({email})
        if(!user){
            res.render('login.ejs',{msg:"User not find"});
        }
        else if(user.password!=password){
            res.render('login.ejs',{msg:"Password is not valid"})
        }
        else{
            res.render('profile.ejs',{user});
        }   
    }
    catch(error){
        console.log(error)
        res.send("Error Occured");
    }
})

app.get('/login',(req,res)=>{
    res.render('Login.ejs');
})
app.get('/',(req,res)=>{
    res.render('Login.ejs');
})

app.get('/users',async (req,res)=>{

    //User.find() function is used to get all the details of all the data stored over the mongo db
    //User.find().sort({createdAt:-1}); to sort it from the date it is created.
    let user=await User.find().sort({createdAt:-1});
    res.render('Users.ejs',{user});
})
app.listen(1000,()=>{
    console.log("Server is running on port 1000");
})
