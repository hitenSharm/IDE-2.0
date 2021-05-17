const codeSaveRoute = require("express").Router();
const auth = require('../middlewares/verifyToken');
const AllCodes=require('../db/models/codes');

codeSaveRoute.post('/save',auth, async(req,res,next)=>{    
    var id=req.user;
    console.log(req.user ,"userInfo");
    var codeInfo=req.fields.code;
    var langData=req.fields.lang;
    var codeName=req.fields.name;
    console.log(codeName);
    const userPresent = await AllCodes.findOne({userId:id});
    if(userPresent)
    {
        var codeArr=userPresent.codes;
        var nameExistCount=0;
        for(var i=0;i<codeArr.length;++i)
        {
            if(i.name==codeName)
            nameExistCount++;
        }
        if(nameExistCount>0)
        {
            nameExistCount++;
            codeName=codeName+'(' + nameExistCount +')';
        }
        var newCode={
            name:codeName,
            lang:langData,
            codeData:codeInfo
        };
        userPresent.codes.push(newCode);
        try {
            const savedUser=await userPresent.save();
            const sendToClient={
                "error":"success",        
                "message":"Saved!"
            }
            console.log("saved code!")
            res.send(sendToClient);
            return next();
        } catch (error) {
            console.error(error);
        }
    }
    else
    {
        var codeArray={
            name:codeName,
            lang:langData,
            codeData:codeInfo
        };
        var newCode= new AllCodes({
            userId:id,
            codes:codeArray
        });
        try {
            const savedData=await newCode.save();
            const sendToClient={
                "error":"success",        
                "message":"Saved!"
            }
            console.log("saved new code!")
            res.send(sendToClient);
            return next();
        } catch (error) {
            console.error(error);
        }
    }

})

module.exports=codeSaveRoute;