const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const token = req.header["auth-token"];
  if (!token) {
    const sendToClient={
        "error":"error",        
        "message":"Log in again"
    }
    res.send(sendToClient);
    next();
  }

  try {
    const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verifiedToken;
    next();
  } catch (error) {
    res.send("Invalid Token");
  }
};
