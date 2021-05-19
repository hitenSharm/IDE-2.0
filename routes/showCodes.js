const codeShowRoute=require("express").Router();
const auth = require('../middlewares/verifyToken');
const AllCodes=require('../db/models/codes');

codeShowRoute.get('/show',auth, async(req,res,next)=>{
    var id=req.user;
    var userPresent=await AllCodes.findOne({userId:id});
    if(userPresent)
    {
        console.log("found user!");
        var codeArr=userPresent.codes;
        res.send(codeArr);
        return next();
    }
    else
    {
        res.send([]);
        return next();
    }
});


module.exports=codeShowRoute;