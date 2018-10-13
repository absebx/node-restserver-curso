const express = require('express');
const _ = require('underscore');
const {verificaToken} = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//obtener todos los productos

app.get('/productos', verificaToken, (req,res)=>{

  //obtener variables opcionales
  let desde = Number(req.query.desde) || 0;
  let cant = Number(req.query.cant) || 10;

  Producto.find({disponible: true})
  .skip(desde)
  .limit(cant)
  .populate('usuario','nombre email role')
  .populate('categoria','descripcion')
  .exec((err, productos)=>{
    if(err)
      return res.status(400).json({
        ok: false,
        err
      });
    
      
    Producto.countDocuments({disponible: true},(err,count)=>{
      if(err)
        return res.status(400).json({
          ok: false,
          err
        });

      res.json({
        ok: true,
        total: count,
        productos
      });
      
    });
  });
});

app.get('/productos/buscar/:termino', verificaToken,(req,res)=>{
  
  let termino = req.params.termino;

  let regex = new RegExp(termino, 'i');


  Producto.find({nombre: regex})
    .populate('categoria','nombre')
    .exec((err,productos)=>{
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        productos
      });      
      
    });
});

//obtener producto por id

app.get('/productos/:id', verificaToken, (req, res)=>{
  let id = req.params.id;

  Producto.findById(id)
  .populate('usuario','nombre email role')
  .populate('categoria','descripcion')
  .exec((err,producto)=>{
    if(err)
      return res.status(400).json({
        ok: false,
        err
      });
    
    res.json({
      ok: true,
      producto
    });
  });
});

//crear nuevo producto

app.post('/productos', verificaToken ,(req,res)=>{

  let {nombre,precioUni,descripcion,categoria} = req.body;

  let usuario = req.usuario._id;

  let producto = new Producto({
    nombre,
    precioUni,
    descripcion,
    categoria,
    usuario
  });

  producto.save((err, productoBd)=>{
    if(err)
      return res.status(500).json({
        ok: false,
        err
      });
    
    res.json({
      ok: true,
      producto: productoBd
    });
  });
});

//Actualizar producto
app.put('/productos/:id', verificaToken, (req,res)=>{
  //modifica producto
  //modifica categoría (del producto)
  let id = req.params.id;

  let body = _.pick(req.body,['nombre','precioUni','descripcion','categoria']); // aquí el objeto queda limpio


  // let {nombre,precioUni,descripcion,categoria,usuario} = req.body; // de ésta manera los datos quedan como undefinied

  // let modifica = {
  //   nombre,precioUni,descripcion,categoria,usuario
  // }

  // console.log(modifica);
  // console.log('===========================================');
  // console.log(body);

  Producto.findByIdAndUpdate(id,body,{new: true, runValidators: true},(err,productoBD)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!productoBD){
      return res.status(404).json({
        ok: false,
        mesage: 'Producto no encontrado'
      });
    }

    res.json({
      ok: true,
      producto: productoBD
    });
  });
});

//borrar un producto
app.delete('/productos/:id', verificaToken, (req,res)=>{
  //simplemente cambia disponible = false
  let id = req.params.id; 

  Producto.findByIdAndUpdate(id,{disponible: false},{new: true},(err,productoBD)=>{
    if(err)
      return res.status(400).json({
        ok: false,
        err
      });

    if(!productoBD)
      return res.status(404).json({
        ok: false,
        mesage: 'Producto no encontrado'
      });
    
    res.status(201).json({
      ok: true,
      producto: productoBD
    });
  });
});

module.exports = app;




