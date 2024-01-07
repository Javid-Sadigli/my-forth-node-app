const express = require('express');
const ROUTER = express.Router();

const AuthController = require('../controllers/auth');

ROUTER.get('/login', AuthController.GET_Login);
ROUTER.get('/logout', AuthController.GET_Log_Out);
ROUTER.get('/register', AuthController.GET_Register);
ROUTER.get('/reset', AuthController.GET_Reset);
ROUTER.get('/reset/info', AuthController.GET_Reset_Info);

ROUTER.post('/login', AuthController.POST_Login);
ROUTER.post('/register', AuthController.POST_Register);
ROUTER.post('/reset', AuthController.POST_Reset);

module.exports = ROUTER;
