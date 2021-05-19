const codeUpdate = require("express").Router();
const auth = require('../middlewares/verifyToken');
const AllCodes=require('../db/models/codes');

codeUpdate.put('/updateCode',auth,async (req,res,next)=>{
    var id=req.user;
    // console.log(req.user ,"userInfo");
    var codeInfo=req.fields.code;
    var langData=req.fields.lang;
    var codeName=req.fields.name;
    await AllCodes.updateOne(
        {userId:id , "codes.name":codeName},
        {
            $set:{
               "codes.$.lang":langData,
               "codes.$.codeData":codeInfo
            }
        }        
    )
    var sendToClient={
        "error":"success",        
        "message":"Saved!"
    }
    res.send(sendToClient);
    return next();
})


module.exports=codeUpdate;