
const jwt = require('jsonwebtoken');

// ----------------------------------------- <> Verify Token
let verifyToken = (req, res, next) => {
    let token = req.get('token'); // Authorization

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
          return res.status(401).json({
              of: false,
              err: {
                  message: 'Invalid token!   :( '
              }
          })
        }
        req.user = decoded.user;
        next();
    });
};

// ----------------------------------------- <> Verify Admin
let verifyAdmin_Role = (req, res, next) => {
   let user = req.user;

   if(user.role === 'ADMIN_ROLE') {
       next();
   } else {
        return res.json({
            ok: false,
            err: {
                message: 'The user is not an administrator'
            }
        })
   }
};

// ----------------------------------------- <> Verify Token Image
let verifyTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                of: false,
                err: {
                    message: 'Invalid token!   :( '
                }
            })
        }
        req.user = decoded.user;
        next();
    });
};

module.exports = {
    verifyToken,
    verifyAdmin_Role,
    verifyTokenImg
};
