const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Ruta para registrar usuario
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = new User({ nombre, email, password: passwordHash });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error en el servidor", error: err.message });
  }
});

// ✅ Ruta para iniciar sesión
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const usuario = await User.findOne({ email: username });
    if (!usuario) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ userId: usuario._id }, "secreto123", { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al iniciar sesión", error: err.message });
  }
});

module.exports = router;
