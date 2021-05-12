const codeRouter=require('express').Router();
const runPycode=require('./langs/python'); 


codeRouter.post('/coderunner' , async(req,res) =>{
    console.log(req.fields);
    const code=req.fields.code;
    const input=req.fields.input;
    const lang=req.fields.lang;
    if(code.length==0){
        res.send({
            error:"error",
            message:"Write some code"
        })
    }
    if(lang=="Python")
    var ans = runPycode(code,input,res);

})



module.exports=codeRouter;