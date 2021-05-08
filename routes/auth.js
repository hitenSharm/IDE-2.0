const router=require('express').Router();
const User = require('../db/models/User')
const {regValidation , loginValidation} = require('./validation')
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');


router.post('/register', async(req,res)=>{

    const respondToValidate = regValidation(req.body);            
    if(respondToValidate.error){
        const sendToClient={
            "error":"error",        
            "message":respondToValidate.error.details[0].message
        }
        res.send(sendToClient);
    }
    
    //if User exists
    const emailPresent=await User.findOne({email:req.body.email});
    if(emailPresent){
        const sendToClient={
            "error":"error",        
            "message":"Email already present!"
        }
        res.send(sendToClient);
    }

    //Hashing password
    const hasedPwd= await bcrypt.hash(req.body.password,10);

    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hasedPwd
    });
    try {
        const savedUser=await user.save();
        res.send({
            user:savedUser.id 
        });
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