const fs = require("fs");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const util = require("util");
const  contentDestroyer  = require("./contenetDestroyer");
const  generateCmd  = require("./generateCmd");
const  containerCommand  = require("./containerCmd");
const exec = util.promisify(require("child_process").exec);

const validateCode = (code,ex) => {
  switch (ex) {
      case ".py":
        wordsLike = [
            "import os",
            "import subprocess",
            "from os import",
            "from subprocess import",
          ];
          break;
  
      case ".cpp":
        wordsLike = [
            "popen", "fork", "system(", "unistd.h"
          ];
          break;
  }
  var validate = !wordsLike.some((word) => {
    return code.includes(word);
  });
  return validate;
};

const runCodeIde = async (code,input,respondToClient,extention) => {

  var dockerCmdToExecuteCode = generateCmd(extention);
  var runContainer = containerCommand(extention);
  var sendToClient;    
  if (validateCode(code,extention)) {    
    var codeFile = uuidv1() + extention;
    var inputFile = uuidv4() + ".txt";
    fs.writeFile(codeFile, code, (err) => {
      if (err) {
        console.log("oops + ",err);
      } else {
        fs.writeFile(inputFile, input, (err) => {
          if (err) {
            console.error(err);
          } else {
            exec(runContainer).then((res) => {              
              var id = res.stdout.substring(0, 12);
              var cmd = `docker cp ${codeFile} ${id}:/usr/src/app/codeFile${extention} && docker cp ${inputFile} ${id}:/usr/src/app/inputFile.txt && docker exec ${id} bash -c ${dockerCmdToExecuteCode}`;
              exec(cmd, { timeout: 20000, maxBuffer: 50000 }).then((res) => {                  
                sendToClient = res.stdout;   
                console.log(sendToClient);                                           
                respondToClient.send(sendToClient);
                contentDestroyer(codeFile,inputFile,id);                
              }).catch((err)=>{                
                var tempErrorString=err.toString();
                var len=tempErrorString.length
                var returnString=tempErrorString.substring(len-cmd.length,len)
                 respondToClient.send(returnString);
                contentDestroyer(codeFile,inputFile,id); 
            });
            }).catch((err)=>{  
                 console.log("no docker!")                               
            });
          }
        });
      }
    });
  }  
};



module.exports = runCodeIde;
