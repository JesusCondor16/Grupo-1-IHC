let RecModel = require("../models/reclamo");

module.exports.recController = {
  getAll: (req, res) => {
    RecModel.find()
      .select({ descripcion: 0, respuesta: 0, __v: 0 })
      .then((list) => {
        res.send(list);
      })
      .catch((err) => {
        res.json({ error: "Error en el controlador" });
      });
  },
  getSinResolver: (req, res) => {
    RecModel.find({ isResuelto: false })
      .select({ descripcion: 0, respuesta: 0, __v: 0 })
      .then((list) => {
        res.send(list);
      })
      .catch((err) => {
        res.json({ error: "Error en el controlador" });
      });
  },
  getReclamo: (req, res) => {
    const { id } = req.params;
    RecModel.findById(id)
      .select({ __v: 0 })
      .then((reclamo) => {
        res.json(reclamo);
      })
      .catch((error) => {
        res.json({ error: "Error en el controlador" });
      });
  },
  getReclamos: (req, res) => {
    const { email } = req.params;
    RecModel.find({ email_asociado: email })
      .select({ __v: 0 })
      .then((list) => {
        res.send(list);
      })
      .catch((error) => {
        res.json({ error: "Error en el controlador" });
      });
  },
  createReclamo: (req, res) => {
    const { email_asociado, descripcion } = req.body;
    const nuevoReclamo = new RecModel({
      email_asociado: email_asociado,
      descripcion: descripcion,
      isResuelto: false,
      fecha_emision: new Date().toLocaleDateString(),
    });
    nuevoReclamo
      .save()
      .then((doc) => {
        res.json({ msg: "Reclamo creado correctamente" });
      })
      .catch((error) => {
        res.json({ error: "Error en el controlador" });
      });
  },
  resolverReclamo: (req, res) => {
    const { id } = req.params;
    const { respuesta } = req.body;
    RecModel.findByIdAndUpdate(id, {
      respuesta: respuesta,
      isResuelto: true,
      fecha_rpta: new Date().toLocaleDateString(),
    })
      .then((doc) => {
        res.json({ msg: "Reclamo resuelto" });
      })
      .catch((error) => {
        res.json({ error: "Error en el controlador" });
      });
  },
};
