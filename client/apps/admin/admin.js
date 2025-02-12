const express = require("express");
const path = require("path");

const admin = express();

// Middleware para servir archivos estáticos
admin.use(express.static(path.join(__dirname, '../../', "public")));

// Middleware para todas las demás rutas
admin.get("*", (req, res) => {
	// Servir el index.html de tu aplicación de React
	res.sendFile(path.join(__dirname, "view", "index.html"));
});

module.exports = admin;