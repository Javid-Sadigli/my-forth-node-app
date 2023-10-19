const hostname = "localhost";
const port = 3000;

const express = require('express');
const app = express();
const path = require('path');
const mainRoot = path.dirname(require.main.filename);
const BodyParser = require('body-parser');
const mongoose = require('mongoose');

const UserRouter = require('./routes/user');
const AdminRouter = require('./routes/admin');
const ErrorController = require('./controllers/error');
const ConsoleController = require('./controllers/console');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(BodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(mainRoot, 'public')));
app.use((req, res, next) => {
    User.findById('65318a141c3d30db0cbf80ca').then((user) => {
        req.user = user;
        next();
    });
});
app.use(ConsoleController.LOG_Request);

app.use('/', UserRouter);
app.use('/admin', AdminRouter);
app.use(ConsoleController.LOG_Not_Found);
app.use(ErrorController.SEND_ERROR);

mongoose.connect(
    'mongodb+srv://JavidSadigli:W61I0z0L3Ifrdxbd@mycluster.49vowqu.mongodb.net/myshop?retryWrites=true&w=majority'
).then((result) => {
    app.listen(port, hostname, () => {
        console.log(`\n\nServer succesfully started at ${hostname}:${port}\n`);
    });
}).catch((error) => {
    console.log(error);
});

