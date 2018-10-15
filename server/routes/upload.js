const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

//opciones por defecto
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req,res)=>{
  let {tipo,id} = req.params;

  //validar que venga archivo
  if(!req.files){
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha enviado ningun archivo"
      }
    });
  }

  //valida tipo
  let tiposValidos = ['productos','usuarios'];
  if(tiposValidos.indexOf(tipo) < 0){
    return res.status(400).json({
      ok: false,
      err: {
        tipo,
        message: 'Los tipos permitidos son '+tiposValidos.join(', ')
      }
    });
  }


  let archivo = req.files.archivo;

  //extensiones validas
  let datosArchivo = archivo.name.split('.');
  let extension = datosArchivo[datosArchivo.length-1].toLowerCase();

  let extensionesValidas = ['png','jpg','gif','jpeg'];

  if(extensionesValidas.indexOf(extension) < 0){ //significa que no está
    return res.status(400).json({
      ok: false,
      err: {
        extension,
        message: 'Las extensiones permitidas son '+extensionesValidas.join(', ')
      }
    });
  }

  //cambiar nombre archivo - hacerlo único

  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err)=>{
    if (err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    //imagen ya guardada
    switch (tipo) {
      case 'usuarios':
        imagenUsuario(id,res,nombreArchivo);
        break;
      case 'productos':
        imagenProducto(id,res,nombreArchivo);
        break;
      default:
        break;
    }
    
 
    // res.json({
    //   ok: true,
    //   message: 'Archivo subido correctamente'
    // });
  });
});

function imagenUsuario(id, res, nombreArchivo){ //cuando javascript pasa objetos, siempre es por referencia
  Usuario.findById(id, (err,usuarioDB)=>{
    if(err){
      borraArchivo(nombreArchivo,'usuarios'); //borrar imagen subida
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuarioDB){
      borraArchivo(nombreArchivo,'usuarios'); //borrar imagen subida
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no existe'
        }
      });
    }

    borraArchivo(usuarioDB.img,'usuarios')

    // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${ usuarioDB.img}`);

    // if(fs.existsSync(pathImagen)){
    //   //si existe se borra
    //   fs.unlinkSync(pathImagen);
    // }

    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioGuardado)=>{
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }
      

      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      })
    });


  });

}

function imagenProducto(id, res, nombreArchivo){
  Producto.findById(id,(err,productoBD)=>{
    // validaciones
    if(err){
      borraArchivo(nombreArchivo,'productos');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!productoBD){
      borraArchivo(nombreArchivo,'productos');
      return res.status(404).json({
        ok: false,
        err: {
          message: 'Producto no encontrado'
        }
      });
    }

    borraArchivo(productoBD.img,'productos');

    //asignar imagen

    productoBD.img = nombreArchivo;
    
    productoBD.save((err,productoBD)=>{
      if(err){
        return res.status(500).json({
          ok:false,
          err
        });
      }

      res.json({
        ok: true,
        producto: productoBD,
        img: nombreArchivo
      })
    });

  });
}

function borraArchivo(nombreImagen,tipo){

  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen}`);

    if(fs.existsSync(pathImagen)){
      //si existe se borra
      fs.unlinkSync(pathImagen);
    }
}

module.exports = app;