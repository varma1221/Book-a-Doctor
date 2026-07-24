const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({
        message: "Auth failed",
        success: false
      });
    }
    const token = authHeader.split(" ")[1];
    const secretKey = process.env.JWT_KEY || process.env.JWT_SECRET || "medicare_default_secret_key_123";
    jwt.verify(token, secretKey, (err, decode) => {
      if (err) {
        return res.status(200).send({
          message: "Auth failed",
          success: false
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Auth error",
      success: false
    });
  }
};
