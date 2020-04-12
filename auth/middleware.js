const { verifyJWTToken } = require('./auth')

function verifyJWT_MW(req, res, next)
{
  let token = req.headers.authorization

  verifyJWTToken(token)
    .then((decodedToken) =>
    {
      req.user = decodedToken.data
      next()
    })
    .catch((err) =>
    {
      res.status(403)
        .json({message: "Invalid auth token provided."})
    })
}

module.exports = {verifyJWT_MW}
