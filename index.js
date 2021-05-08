const express = require("express");
const app = express();
const dotenv= require('dotenv')
const mongoose = require("mongoose");

dotenv.config();

mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true },
  () => {
    console.log("Connected to db!");
  }
);
//import routes
const authRoute = require("./routes/auth");
const codeExe = require('./routes/codeExecutor/runCode');

app.use(express.json());
app.use("/api/user", authRoute);
app.use('/coding' ,codeExe);



app.listen(3000, () => {
  console.log("Serever ready");
});
