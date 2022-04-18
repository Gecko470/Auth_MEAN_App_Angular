const mongoose = require("mongoose");


const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    catch (error) {

        console.log(error);
        throw new Error('Error de conexión a la base de datos..')
    }

}

module.exports = { dbConnection }