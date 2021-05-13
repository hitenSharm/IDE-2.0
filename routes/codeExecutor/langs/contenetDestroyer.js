const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

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

  module.exports=contentDestroyer;