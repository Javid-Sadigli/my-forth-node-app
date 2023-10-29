const express = require('express');

const ROUTER = express.Router();

const AuthController = require('../controllers/auth');

ROUTER.get('/login', AuthController.getLogin);

module.exports = ROUTER;
