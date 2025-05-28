const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Registrar usuario
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new User({ nombre, email, password: hashedPassword });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error en el servidor", error: err.message });
  }
});

// Iniciar sesión
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 👀 Agregá esta línea para ver lo que recibe el backend
    console.log("📩 Datos recibidos en login:", { email, password });

    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ userId: usuario._id }, "secreto123", { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al iniciar sesión", error: err.message });
  }
});


module.exports = router;