const hostname = "localhost";
const port = 3000;
const MONGODB_CONECTION_URI = 'mongodb+srv://JavidSadigli:W61I0z0L3Ifrdxbd@mycluster.49vowqu.mongodb.net/myshop?retryWrites=true&w=majority';

const express = require('express');
const app = express();
const path = require('path');
const mainRoot = path.dirname(require.main.filename);
const BodyParser = require('body-parser');
const session = require('express-session');
const mongodb_store_sesion = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const csrf = require("csurf");

const UserRouter = require('./routes/user');
const AdminRouter = require('./routes/admin');
const AuthRouter = require('./routes/auth');
const ErrorController = require('./controllers/error');
const ConsoleController = require('./controllers/console');
const MainController = require('./controllers/main');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new mongodb_store_sesion({
    uri : MONGODB_CONECTION_URI, 
    collection : 'sessions'
});
const csrfProtection = csrf();

app.use(BodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(mainRoot, 'public')));
app.use(session({secret : 'mysecret', resave: false, saveUninitialized : false, store : store}));
app.use(csrfProtection);

app.use(ConsoleController.LOG_Request);
app.use(MainController.CHECK_Logged_In);
app.use(MainController.SET_Local_Variables);

app.use('/', AuthRouter);
app.use('/', UserRouter);
app.use('/admin', AdminRouter);
app.use(ConsoleController.LOG_Not_Found);
app.use(ErrorController.SEND_ERROR);

mongoose.connect(
    MONGODB_CONECTION_URI
).then((result) => {
    app.listen(port, hostname, () => {
        console.log(`\n\nServer succesfully started at ${hostname}:${port}\n`);
    });
}).catch((error) => {
    console.log(error);
});

