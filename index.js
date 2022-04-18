const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./database/config');
require('dotenv').config();

//console.log(process.env);
const app = express();

//Base de datos
dbConnection();

//Ruta / GET, directorio público
app.use(express.static('public'));

//Cors
app.use(cors())

//Lectura y parseo de imformación del body de los headers
app.use(express.json())

//Rutas
app.use('/api/auth', require('./routes/auth.routes'))

//Rutas diferentes a las establecidas con el Router de Express, las del build de Angular
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'))
});


app.listen(process.env.PORT, () => {
    console.log(`Servidor express levantado en el puerto ${process.env.PORT}`)
})