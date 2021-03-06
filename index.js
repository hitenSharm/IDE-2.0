const express = require("express");
const app = express();
const dotenv= require('dotenv')
var formidable = require("express-formidable");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

app.use(cors());
app.use(formidable());

mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, res) {
      try {
          console.log('Connected to Database');
      } catch (err) {
          throw err;
      }
  });
//import routes
const authRoute = require("./routes/auth");
const codeExe = require('./routes/codeExecutor/runCode');
const codeSaveRoute = require('./routes/saveCode');
const codeShowRoute=require('./routes/showCodes');
const codeUpdate = require('./routes/updateCode')

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.use("/api/user", authRoute);
app.use("/coding" ,codeExe);
app.use("/codesave",codeSaveRoute);
app.use("/seeCodes",codeShowRoute);
app.use("/update",codeUpdate);

app.listen(3000, () => {
  console.log("Serever ready");
});
