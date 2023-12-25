const User = require('../models/user');

module.exports.Is_Authenticated = (req, res, next) => {
    if(req.logged_in)
    {
        next();
    }
    else 
    {
        res.redirect('/login');
    }
};

module.exports.CHECK_Logged_In = (req, res, next) => {
    if(req.session.user)
    {
        User.findById(req.session.user._id).then((user) => {
            if(user)
            {
                req.user = user;
                req.logged_in = true; 
                next();
            }
            else
            {
                next();
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    else
    {
        req.logged_in = false;
        next();
    }
};

module.exports.SET_Local_Variables = (req, res, next) => {
    res.locals.logged_in = req.logged_in;
    res.locals.user = req.user;
    res.locals.csrf_token = req.csrfToken();
    next();
};