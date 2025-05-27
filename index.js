const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Conectado a MongoDB");

    app.listen(3000, () => {
      console.log("🚀 Servidor escuchando en http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err);
  });
  