require('./config/config'); //es lo primero que ejecutará

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) //los use son middlewares, se ejecutan siempre por una petición
 
// parse application/json
app.use(bodyParser.json())

app.use( require ('./routes/usuario'));

mongoose.connect(process.env.URLDB,(err,res)=>{
  if(err){
    throw err;
  }
  console.log('Base de datos online');
});

 
app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto ${process.env.PORT}`);
})