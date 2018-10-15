const express = require('express');
const fs = require('fs');
const path = require('path');
const {verificaTokenImg} = require('../middlewares/autenticacion');
const app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req,res)=>{
  let {tipo,img} = req.params;

  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ img}`); //el dirname es de donde estoy ahora

  if(fs.existsSync(pathImagen)){
    res.sendFile(pathImagen)
  }else{
    let noImagePath = path.resolve(__dirname,'../assets/no-image.jpg');
    res.sendFile(noImagePath);
  }

});

module.exports = app;