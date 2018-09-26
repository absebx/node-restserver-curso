const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', function (req, res) {

  let desde = req.query.desde || 0; //cuando son opcionales
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  let condicion = {estado: true}

  Usuario.find(condicion, 'nombre email role estado google img') //los campos que se mandarán
    .skip(desde)
    .limit(limite)
    .exec((err,usuarios)=>{
      if(err){
        return res.status(400).json({
          ok: false,
          err
        });
      }

      Usuario.countDocuments(condicion,(err,conteo)=>{
        res.json({
          ok: true,
          total: conteo,
          usuarios
        })
      })
      
    });
});

app.post('/usuario', function (req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password:  bcrypt.hashSync(body.password,10) ,
    // img: body.img
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    // usuarioDB.password = null;


    res.json({ //en esta es 200 por defecto
      ok: true,
      usuario: usuarioDB
    })
  });
});

app.put('/usuario/:id', function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body,['nombre','email','img','role','estado']);

  // delete body.password;
  // delete body.goolgle;

  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true},(err,usuarioDB) => {

    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  })

});

app.delete('/usuario/:id', function (req, res) {
  let id = req.params.id;
  let propiedades = {
    estado: false
  }
  Usuario.findByIdAndUpdate(id,propiedades,{new: true},(err,usuarioDB)=>{
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }
    if(usuarioDB){
      res.json({
        ok:true,
        usuario: usuarioDB
      });
    }else{
      res.json({
        ok:false,
        err:  {
          message: 'Usuario no encontrado'
        }
      });
    }
  });

  //borrar fisicamente
  // Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
  //   if(err){
  //     return res.status(400).json({
  //       ok: false,
  //       err
  //     });
  //   }

  //   if(usuarioBorrado){
  //     res.json({
  //       ok: true,
  //       usuario: usuarioBorrado
  //     });
  //   }else{
  //     res.json({
  //       ok: false,
  //       err: {
  //         message: 'Usuario no encontrado'
  //       }
  //     });
  //   }
  // });

})

module.exports = app;