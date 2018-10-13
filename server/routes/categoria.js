const express = require('express');
const _ = require('underscore');
const {verificaToken,verificaAdminRole} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//Mostrar todas las categorías
app.get('/categoria', verificaToken,(req, res)=>{
  Categoria.find({})
  .sort('descripcion')
  .populate('usuario', 'nombre email')
  .exec((err,categorias)=>{
    if(err)
      return res.status(400).json({
        ok: false,
        err
      });
    
    res.json({
      ok: true,
      total: categorias.length,
      categorias
    });

  });
});

//mostrar categoria por id
app.get('/categoria/:id',verificaToken,(req,res)=>{
  let id = req.params.id;

  Categoria.findById(id,(err, categoria)=>{
    if(err)
      return res.status(400).json({
        ok: false,
        err
      });
    
    if(!categoria){
      return res.status(404).json({
        ok: false,
        err: {
          message: `Categoria con id ${id}, no encontrada`
        }
      });
    }

    res.json({
      ok: true,
      categoria
    });
  });
});

//crear categoría
app.post('/categoria', verificaToken ,(req, res)=>{
  let body = req.body;
  let usuarioId = req.usuario._id; //por verifica token
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: usuarioId
  });
  categoria.save((err,categoriaBd)=>{
    if(err)
      return res.status(400).json({
        ok: false,
        err
      });
    
    res.json({
      ok: true,
      categoria: categoriaBd
    });
    
  });
});

//modificar categoría
app.put('/categoria/:id', verificaToken, (req,res)=>{
  let id = req.params.id;
  let body = _.pick(req.body,['descripcion']);

  Categoria.findByIdAndUpdate(id,body,{ new: true, runValidators: true},(err, categoriaBd)=>{
    if(err)
      return res.status(400).json({
        ok: false,
        err
      });

    if(!categoriaBd){
      return res.status(404).json({
        ok: false,
        err: {
          message: `Categoria con id ${id}, no encontrada`
        }
      });
    }

    res.json({
      ok: true,
      categoria: categoriaBd
    });
    
  });
});

//Eliminar una categoría
app.delete('/categoria/:id', [verificaToken,verificaAdminRole], (req,res)=>{
  let id = req.params.id;

  Categoria.findByIdAndRemove(id,(err,categoriaDb)=>{
    if(err)
      return res.status(400).json({
        ok: false,
        err
      });

    if(!categoriaDb){
      return res.status(404).json({
        ok: false,
        err: {
          message: `Categoria con id ${id}, no encontrada`
        }
      });
    }

    res.json({
      ok:true,
      categoria: categoriaDb
    });
    
  });
});




module.exports = app;