/**
 * path : api/login
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, renewToken } = require('../controllers/auth');
const { validatCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contrasena es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validatCampos
] ,crearUsuario);

// validarJWT
router.get('/renew', validarJWT , renewToken);

router.post('/', [
    check('password', 'La contrasena es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validatCampos
] , loginUsuario);



module.exports = router;