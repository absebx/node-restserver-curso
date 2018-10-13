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
//Vencimiento del token
//==================================
//60 seg, 60 min, 24 horas, 30 días
// process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 *30;
process.env.CADUCIDAD_TOKEN = '48h';

//==================================
//Seed de autenticación
//==================================
process.env.SEED = process.env.SEED || 'el-seed-de-desarrollo'; // se declara en heroku

//==================================
//base datos
//==================================
let urlDB;
if (process.env.NODE_ENV === 'dev'){
  urlDB = 'mongodb://localhost:27017/cafe';
}else{
  urlDB = process.env.MONGO_URI; //LA VARIABLE SERÁ POR HEROKU
}

process.env.URLDB = urlDB;

//==================================
//google client id
//==================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '559356825961-vf286e9lj3qqtbaa37fc91krvvs8cegp.apps.googleusercontent.com';



