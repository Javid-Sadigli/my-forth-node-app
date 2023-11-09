const express = require('express');

const ROUTER = express.Router();

const AuthController = require('../controllers/auth');

ROUTER.get('/login', AuthController.GET_Login);

ROUTER.post('/login', AuthController.POST_Login);

module.exports = ROUTER;
