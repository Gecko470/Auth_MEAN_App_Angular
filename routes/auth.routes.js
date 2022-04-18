const { Router } = require('express');
const { check } = require('express-validator');
const { newUser, loginUser, renewUser } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/auth.middleware');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new', [
    check('name', 'El nombre es obligatorio..').not().isEmpty(),
    check('email', 'El email es obligatorio y debe ser un email válido..').not().isEmpty().isEmail(),
    check('password', 'El password es obligatorio y debe tener al menos 6 caracteres..').not().isEmpty().isLength({ min: 6 }),
    validarCampos
], newUser);

router.post('/', [
    check('email', 'El email es obligatorio y debe ser un email válido..').not().isEmpty().isEmail(),
    check('password', 'El password es obligatorio y debe tener al menos 6 caracteres..').not().isEmpty().isLength({ min: 6 }),
    validarCampos
], loginUser);

router.get('/renew', validarJWT, renewUser);



module.exports = router;