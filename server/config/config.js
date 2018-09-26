//==================================
//Puerto
//==================================
//si no existe, se le asigna de desarrollo
process.env.PORT = process.env.PORT || 3000;

//==================================
//Entorno
//==================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev' //si no existe, estoy en desarrollo

//==================================
//Entorno
//==================================
let urlDB;
if (process.env.NODE_ENV === 'dev'){
  urlDB = 'mongodb://localhost:27017/cafe';
}else{
  urlDB = process.env.MONGO_URI; //LA VARIABLE SERÁ POR HEROKU
}

process.env.URLDB = urlDB;




