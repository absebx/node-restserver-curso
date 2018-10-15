const jwt = require('jsonwebtoken');

//=====================
//Verificar Token
//=====================

let verificaToken = (req, res, next)=>{
  let token = req.get('token'); //get para obtener los token

  jwt.verify(token, process.env.SEED, (err,decoded)=>{
    if(err){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Token no válido'
        }
      });
    }

    req.usuario = decoded.usuario; //estoy al req el payload del usuario
    next();
  });
  // res.json({
  //   token: token
  // });

  // si no se llama el next, nunca se ejecutará el la petición
  // next();
}

//=====================
//Verificar admin rol
//=====================

let verificaAdminRole = (req, res, next)=>{
  let usuario = req.usuario;

  if(usuario.role !== 'ADMIN_ROLE'){
    return res.status(401).json({
      ok: false,
      err: {
        message: 'El usuario no es administrador'
      }
    });
  }

  next();
}

//=====================
//Verificar token por url
//=====================

verificaTokenImg = (req,res,next) => {
   let token = req.query.token; //parametro opcional de token

   jwt.verify(token, process.env.SEED, (err,decoded)=>{
    if(err){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Token no válido'
        }
      });
    }

    req.usuario = decoded.usuario; //estoy al req el payload del usuario
    next();
  });
  
}

module.exports = {
  verificaToken,
  verificaAdminRole,
  verificaTokenImg
}