const router=require('express').Router();
const runPycode=require('./langs/python'); 


router.post('/coderunner' , (req,res) =>{
    const code=req.body.code;
    const input=req.body.input;
    // const id=req.body.id;
    var ans = runPycode(code,input);
    console.log(ans);
    res.send(ans);    
})



module.exports=router;