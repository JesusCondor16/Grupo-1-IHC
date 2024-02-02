let EstModel = require("../models/estudiante");

module.exports.estController = {
  getAll: (req, res) => {
    EstModel.find()
      .select({ _id: 0, __v: 0, password: 0 })
      .then((list) => {
        res.send(list);
      })
      .catch((err) => {
        res.json({ error: "Error en el controlador" });
      });
  },
  getEstudiante: (req, res) => {
    const { email } = req.params;
    EstModel.findOne({ email: email })
      .select({ _id: 0, __v: 0, password: 0 })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.json({ error: "Error en el controlador" });
      });
  },
  getEstudianteCod: (req, res) => {
    const { codigo } = req.params;
    EstModel.findOne({ codigo: codigo })
      .select({ _id: 0, __v: 0, password: 0 })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.json({ error: "Error en el controlador" });
      });
  },
  createEstudiante: (req, res) => {
    const {
      codigo,
      nombre,
      apellido_pat,
      apellido_mat,
      telefono,
      email,
      password,
      isDelegado,
    } = req.body;
    const newEstudiante = new EstModel({
      codigo: codigo,
      nombre: nombre,
      apellido_pat: apellido_pat,
      apellido_mat: apellido_mat,
      telefono: telefono,
      email: email,
      password: password,
      isDelegado: isDelegado,
    });
    newEstudiante
      .save()
      .then((doc) => {
        res.json({ msg: "Estudiante registrado correctamente" });
      })
      .catch((err) => {
        res.json({ error: "Error en el controlador" });
      });
  },
  updateNotas: (req, res) => {
    const { email } = req.params;
    const { nota_ec, nota_ep, nota_ef } = req.body;
    promedio = (nota_ec + nota_ep + nota_ef) / 3;
    promedio = Math.round(promedio);

    EstModel.updateOne(
      { email: email },
      {
        $set: {
          nota_ec: nota_ec,
          nota_ep: nota_ep,
          nota_ef: nota_ef,
          promedio: promedio,
        },
      }
    )
      .then(() => {
        res.json({ msg: "Notas ingresadas correctamente" });
      })
      .catch(() => {
        res.json({ error: "Error en el controlador" });
      });
  },
  updateEstudiante: (req, res) => {
    const { email } = req.params;
    const {
      codigo,
      nombre,
      apellido_pat,
      apellido_mat,
      telefono,
      nuevoEmail,
      password,
      isDelegado,
    } = req.body;
    EstModel.updateOne(
      { email: email },
      {
        $set: {
          codigo: codigo,
          nombre: nombre,
          apellido_pat: apellido_pat,
          apellido_mat: apellido_mat,
          telefono: telefono,
          email: nuevoEmail,
          password: password,
          isDelegado: isDelegado,
        },
      }
    )
      .then(() => {
        res.json({ msg: "Datos modificados correctamente" });
      })
      .catch(() => {
        res.json({ error: "Error en el controlador" });
      });
  },
  updateTelefono: (req, res) => {
    const { email, nuevoTelefono } = req.body;
    EstModel.updateOne({ email: email }, { $set: { telefono: nuevoTelefono } })
      .then((result) => {
        res.json({ msg: "Telefono modificado correctamente" });
      })
      .catch((err) => {
        res.json({ msg: "Error en el controlador" });
      });
  },
  deleteEstudiante: (req, res) => {
    const { email } = req.params;
    EstModel.deleteOne({ email: email })
      .then((doc) => {
        res.json({ msg: "Estudiante eliminado correctamente" });
      })
      .catch((error) => {
        res.json({ error: "Error en el controlador" });
      });
  },

  login: (req, res) => {
    const { email, password } = req.body;
    EstModel.findOne({ email: email, password: password })
      .then((usuarioEncontrado) => {
        if (usuarioEncontrado) {
          res.json({ succes: true, msg: "Inicio de sesion exitoso" });
        } else {
          res.json({ succes: false, msg: "Credenciales incorrectas" });
        }
      })
      .catch((error) => {
        res.json({ msg: "Error en el controlador" });
      });
  },
};
