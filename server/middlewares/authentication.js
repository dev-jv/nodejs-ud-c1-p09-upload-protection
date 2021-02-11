
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

module.exports = {
    verifyToken,
    verifyAdmin_Role
};
