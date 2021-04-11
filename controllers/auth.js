const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  const usuario = new Usuario(req.body);

  try {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res
        .status(400)
        .json({ ok: false, msg: "El correo ya esta registrado" });
    }
    //Encriptar la contrasena
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();
    // Generar mi JWT

    const token = await generarJWT(usuario.id);

    return res.json({ ok: true, usuario, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const loginUsuario = async (req, res = response) => {
  try {
    const { email, password } = req.body;
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return res.status(404).json({ ok: false, msg: "email no encontrador" });
    }

    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(404).json({ ok: false, msg: "password no valida" });
    }

    // Generar el JWT
    const token = await generarJWT(usuarioDB.id);

    res.json({ ok: true, usuario: usuarioDB, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
  return res.json({ ok: true, msg: "Login" });
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  const token = await generarJWT(uid);

  try {
    const usuarioDB = await Usuario.findById(uid);

    res.json({ ok: true, usuario: usuarioDB, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

module.exports = {
  crearUsuario,
  loginUsuario,
  renewToken,
};
