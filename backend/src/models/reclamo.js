let mongoose = require("mongoose");

let reclamoSchema = new mongoose.Schema({
  email_asociado: String,
  descripcion: String,
  fecha_emision: String,
  respuesta: String,
  isResuelto: Boolean,
  fecha_rpta: String,
});

module.exports = mongoose.model("Reclamo", reclamoSchema);
