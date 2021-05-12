const fs = require("fs");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const validateCode = (code) => {
  wordsLike = [
    "import os",
    "import subprocess",
    "from os import",
    "from subprocess import",
  ];
  var validate = !wordsLike.some((word) => {
    return code.includes(word);
  });
  return validate;
};

const runPycode = async (code, input , respondToClient) => {
  var sendToClient;

  if (validateCode(code)) {
    var codeFile = uuidv1() + ".py";
    var inputFile = uuidv4() + ".txt";
    fs.writeFile(codeFile, code, (err) => {
      if (err) {
        console.error(err);
      } else {
        fs.writeFile(inputFile, input, (err) => {
          if (err) {
            console.error(err);
          } else {
            exec("docker run -d -it python:v1 /bin/bash").then((res) => {              
              var id = res.stdout.substring(0, 12);
              var cmd = `docker cp ${codeFile} ${id}:/usr/src/app/codeFile.py && docker cp ${inputFile} ${id}:/usr/src/app/inputFile.txt && docker exec ${id} bash -c "python3 codeFile.py<inputFile.txt"`;
              exec(cmd, { timeout: 20000, maxBuffer: 50000 }).then((res) => {                  
                sendToClient = res.stdout;                                              
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

const contentDestroyer = (file1,file2,id)=>{
  fileUnliker(file1);
  fileUnliker(file2);
  exec(`docker kill ${id}`).then(() =>
    console.log("Container Stopped")
  );
}

const fileUnliker = (file = null) => {
  if (file) {
    fs.unlink(file, (err) => {
      if (err) console.error(err);
    });
  }
};

module.exports = runPycode;
