const express = require('express');
const ROUTER = express.Router();

const AuthController = require('../controllers/auth');

ROUTER.get('/login', AuthController.GET_Login);
ROUTER.get('/logout', AuthController.GET_Log_Out);
ROUTER.get('/register', AuthController.GET_Register);

ROUTER.post('/login', AuthController.POST_Login);
ROUTER.post('/register', AuthController.POST_Register);

module.exports = ROUTER;
