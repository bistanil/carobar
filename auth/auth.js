const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.json").secretKey;

function verifyJWTToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err);
      }

      resolve(decodedToken);
    });
  });
}

function createJWToken(details) {
  if (typeof details !== "object") {
    details = {};
  }

  if (!details.maxAge || typeof details.maxAge !== "number") {
    details.maxAge = 3600;
  }

  let token = jwt.sign(details.sessionData, JWT_SECRET, {
    expiresIn: details.maxAge,
    algorithm: "HS256",
  });

  return token;
}

module.exports = {
  verifyJWTToken,
  createJWToken,
};
