const codeRouter=require('express').Router();
const runPycode=require('./langs/python'); 


codeRouter.post('/coderunner' , async(req,res) =>{
    console.log(req.fields);
    const code=req.fields.code;
    const input=req.fields.input;
    console.log(code);
    console.log(input);
    // const id=req.body.id;
    var ans = await runPycode(code,input);
    console.log(ans);
    res.send(ans);        
})



module.exports=codeRouter;