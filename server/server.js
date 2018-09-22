require('./config/config'); //es lo primero que ejecutará

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) //los use son middlewares, se ejecutan siempre por una petición
 
// parse application/json
app.use(bodyParser.json())

 
app.get('/usuario', function (req, res) {
  res.json('get usuario')
})

app.post('/usuario', function (req, res) {
  let body = req.body;

  if (body.nombre === undefined){
    res.status(400).json({
      ok: false,
      mensaje: "EL nombre es necesario"
    }); //bad request
  }else{
    res.json({
      persona: body
    })
  }
})

app.put('/usuario/:id', function (req, res) {
  let id = req.params.id;
  res.json({
    id
  });
})

app.delete('/usuario', function (req, res) {
  res.json('delete usuario')
})
 
app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto ${process.env.PORT}`);
})