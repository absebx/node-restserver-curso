const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const app = express();

app.post('/login',(req,res)=>{
  let body = req.body;

  Usuario.findOne({email: body.email}, (err, userDB)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!userDB){
      return res.status(404).json({
        ok: false,
        err: {
          message: '(Usuario) o contraseña incorrectos'
        }
      });
    }

    if( !bcrypt.compareSync(body.password,userDB.password)){
      return res.status(404).json({
        ok: false,
        err: {
          message: 'Usuario o (contraseña) incorrectos'
        }
      });
    }


    let token = jwt.sign({
      usuario: userDB //payload del token
    }, process.env.SEED, //token segun el env
    {expiresIn: process.env.CADUCIDAD_TOKEN})

    res.json({
      ok: true,
      usuario: userDB,
      token
    });


  });

});

//configuracion de google

async function verify( token ) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
}

app.post('/google',async (req,res)=>{
  let token = req.body.idtoken;

  let googleUser = await verify(token)
    .catch(e => {
      return res.status(403).json({
        ok: false,
        err: e
      });
    });
  
  Usuario.findOne({email: googleUser.email}, (err,userDB)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(userDB){
      //ya es usuario
      if(userDB.google === false){
        //Ya era usuario
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Tiene que usar su autenticación normal'
          }
        });
      }else{
        //Por google
        let token = jwt.sign({
          usuario: userDB //payload del token
        }, process.env.SEED, //token segun el env
        {expiresIn: process.env.CADUCIDAD_TOKEN});
        
        return res.json({
          ok: true,
          usuario: userDB,
          token
        });
      }
    }else{
      //primera vez por google
      let usuario = new Usuario();
      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ':)'; //porque password es por base de datos

      usuario.save((err,userDB)=>{
        if(err){
          return res.status(500).json({
            ok: false,
            err
          });
        }

        let token = jwt.sign({
          usuario: userDB //payload del token
        }, process.env.SEED, //token segun el env
        {expiresIn: process.env.CADUCIDAD_TOKEN});

        return res.json({
          ok: true,
          usuario: userDB,
          token
        });
      });
    }
  });

  // res.json({
  //   usuario: googleUser
  // });

})

module.exports = app;