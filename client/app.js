const express = require("express");
const vhost = require("vhost");

require('dotenv').config();

const clientApp = require('./apps/client/client');
const adminApp = require("./apps/admin/admin");

const app = express();

// Configuración de vhost
app.use(vhost("myphotostudy.com", clientApp));
app.use(vhost("admin.myphotostudy.com", adminApp));

// Manejar solicitudes que no coincidan con ningún dominio
app.use((req, res) => {
	res.status(404).send("Página no encontrada");
});

/*
app.listen(8080, () => {
	console.log("Servidor escuchando en el puerto 8080");
});
*/
module.exports = app;
