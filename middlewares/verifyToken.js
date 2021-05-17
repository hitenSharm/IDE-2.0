const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const token = req.header('auth-token');
  // console.log(token);
  if (!token) {
    const sendToClient={
        "error":"error",        
        "message":"Log in again"
    }
    console.log("not verified");
    res.send(sendToClient);
    next();
  }
  try {
    const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verifiedToken; //sends id    
    console.log("verified");
    next();
  } catch (error) {
    const sendToClient={
      "error":"error",        
      "message":"Invalid Token"
  }
    res.send(sendToClient);
  }
};
