const codeRouter = require("express").Router();
const runCodeIde = require("./langs/runCodeExec");

codeRouter.post("/coderunner", async (req, res) => {  
  const code = req.fields.code;
  const input = req.fields.input;
  const lang = req.fields.lang;
  if (code.length == 0) {
    res.send({
      error: "error",
      message: "Write some code",
    });
  }
  if (lang == "Python") {
    var extension = ".py";
    runCodeIde(code, input, res, extension);
  }
  if (lang == "C++") {
    var extension = ".cpp";
    runCodeIde(code, input, res, extension);
  }
});

module.exports = codeRouter;
