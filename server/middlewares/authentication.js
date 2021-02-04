
const jwt = require('jsonwebtoken');

// Verificar token
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

let verifyAdmin_Role =(req, res, next) => {
   let user = req.user;

   if(user.role === 'ADMIN_ROLE') {
       next();
   } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es un administrador'
            }
        })
   }
};

module.exports = {
    verifyToken,
    verifyAdmin_Role
};
