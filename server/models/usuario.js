const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
  values: ['ADMIN_ROLE','USER_ROLE'],
  message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'Nombre obligatorio'] //mensaje cuando ocurra un error
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'EL correo es necesario']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos
  },
  estado: {
    type: Boolean,
    default: true
    // required: [true, 'El estado es obligatorio']
  },
  google: {
    type: Boolean,
    default: false
    // required: [true, 'El campo "google" es obligatorio']
  }
});

usuarioSchema.methods.toJSON = function(){ //siempre que se intenta imprimir
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único'});

module.exports = mongoose.model('Usuario',usuarioSchema);
