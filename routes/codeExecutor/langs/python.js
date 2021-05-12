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
  var validate = !wordsLike.some((shit) => {
    return code.includes(shit);
  });
  return validate;
};

const runPycode = async (code, input) => {
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
              console.log(res);
              var id = res.stdout.substring(0, 12);
              var cmd = `docker cp ${codeFile} ${id}:/usr/src/app/codeFile.py && docker cp ${inputFile} ${id}:/usr/src/app/inputFile.txt && docker exec ${id} bash -c "python3 codeFile.py<inputFile.txt"`;
              exec(cmd, { timeout: 20000, maxBuffer: 50000 }).then((res) => {
                console.log(res);
                sendToClient = res.stdout;
                fileUnliker(codeFile);
                fileUnliker(inputFile);
                console.log(sendToClient + "ANSWER");
                exec(`docker kill ${id}`).then(() =>
                  console.log("Container Stopped")
                );
                return sendToClient;
              }).catch((err)=>{
                console.error(err);
            });
            }).catch((err)=>{
                console.log(err);
                fileUnliker(codeFile);
                fileUnliker(inputFile);

                exec(`docker kill ${id}`).then(() =>
                  console.log("Container Stopped")
                );
            });
          }
        });
      }
    });
  }
  return { done: "nope" };
};

const fileUnliker = (file = null) => {
  if (file) {
    fs.unlink(file, (err) => {
      if (err) console.error(err);
    });
  }
};

module.exports = runPycode;
