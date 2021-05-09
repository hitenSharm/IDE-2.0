const router=require('express').Router();
const User = require('../db/models/User')
const {regValidation , loginValidation} = require('./validation')
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');


router.post('/register', async(req,res,next)=>{
    // console.log(req.fields);
    const respondToValidate = regValidation(req.fields);            
    
    if(respondToValidate.error){
        const sendToClient={
            "error":"error",        
            "message":respondToValidate.error.details[0].message
        }
        res.send(sendToClient);
        return next();
    }
    
    //if User exists
    const emailPresent=await User.findOne({email:req.fields.email});
    if(emailPresent){
        const sendToClient={
            "error":"error",        
            "message":"Email already present!"
        }
        res.send(sendToClient);
        return next();
    }

    //Hashing password
    const hasedPwd= await bcrypt.hash(req.fields.password,10);

    const user = new User({
        name:req.fields.name,
        email:req.fields.email,
        password:hasedPwd
    });
    try {
        const savedUser=await user.save();
        const sendToClient={
            "error":"success",        
            "message":"Success"
        }
        res.send(sendToClient);
        return next();
    } catch (error) {
        console.error(error);
    }
})

router.post('/login' , async(req,res)=>{
    
    //validate
    const respondToValidate = loginValidation(req.body);            
    if(respondToValidate.error){
        const sendToClient={
            "error":"error",        
            "message":respondToValidate.error.details[0].message
        }
        res.send(sendToClient);
    }

    const user=await User.findOne({email:req.body.email});
    if(!user){
        const sendToClient={
            "error":"error",        
            "message":"Not registered!"
        }
        res.send(sendToClient);
    }

    const validPass = await bcrypt.compare(req.body.password,user.password);

    if(!validPass){
        const sendToClient={
            "error":"error",        
            "message":"Invalid Password"
        }
        res.send(sendToClient);
    }else{
        const token=jwt.sign({
            _id:user.id            
        } , process.env.TOKEN_SECRET , {
            expiresIn:'6h'
        });

        res.header('auth-token',token).send(token);
    }

})


module.exports=router;