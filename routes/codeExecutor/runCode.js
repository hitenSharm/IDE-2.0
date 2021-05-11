const router=require('express').Router();
const runPycode=require('./langs/python'); 


router.post('/coderunner' , (req,res) =>{
    console.log(req.body);
    // const code=req.body.code;
    // const input=req.body.input;
    // console.log("code");
    // console.log(input);
    // // const id=req.body.id;
    // var ans = runPycode(code,input);
    // console.log(ans);
    // res.send(ans);    
    res.send("hi");
})



module.exports=router;