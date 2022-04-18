const { response, request } = require('express');//Para obtener todos los métodos y propiedades de la response y request de NodeExpress, 
//si no hacemos esto, no tendríamos en este archivo ese objeto, en el archivo auth.routes.js si porque tenemos importado el Router de Express
const Usuario = require('../models/User');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')


const newUser = async (req = request, res = response) => {

    const { name, email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email: email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ese email ya existe en nuestra Base de Datos, debe ingresar otro..'
            })
        }

        const dbUser = new Usuario(req.body);

        //ENCRIPTAR CONSTRASEÑA
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        //GENERAR JWT
        const token = await generarJWT(dbUser.id, name)


        await dbUser.save();

        return res.json({
            ok: true,
            msg: 'Usuario creado correctamente en nuestra Base de Datos..',
            uid: dbUser.id,
            name,
            email,
            token
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno servidor..'
        })
    }
}


const loginUser = async (req = request, res = response) => {

    const { email, password } = req.body;

    try {

        const dbUser = await Usuario.findOne({ email: email });
        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'Datos de acceso incorrectos..'
            });
        }

        const validPassword = bcrypt.compareSync(password, dbUser.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Datos de acceso incorrectos..'
            });
        }
        //GENERAR JWT
        const token = await generarJWT(dbUser.id, dbUser.name);

        return res.json({
            ok: true,
            msg: 'Usuario identificado correctamente..',
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        })

    }
    catch (err) {
        return res.status(500).json({
            ok: false,
            msg: 'Error interno servidor..'
        });
    }


}

const renewUser = async (req = request, res = response) => {

    const { uid } = req;

    const dbUser = await Usuario.findById(uid);

    //REGENERAR JWT
    const token = await generarJWT(dbUser.id, dbUser.name);
    
    return res.json({
        ok: true,
        msg: 'Ruta renew..',
        uid: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
}



module.exports = {
    newUser, loginUser, renewUser
}