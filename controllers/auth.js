const User = require('../models/user');

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

module.exports.GET_Login = (req, res, next) => {
    if(!req.logged_in)
    {
        res.render('auth/login', {PageTitle : 'Login', logged_in : req.logged_in, user : req.user});
    }
    else
    {
        next();
    }
};  
module.exports.POST_Login = (req, res, next) => {
    User.findOne({
        email : req.body.email,
        password : req.body.password
    }).then((user) => {
        if(user)
        {
            req.session.user = user; 
            res.redirect("/"); 
        }
        else
        {
            res.redirect("/login");
        }
    }).catch((err) => {
        console.log(err);
    });
};
module.exports.GET_Log_Out = (req, res, next) => {
    req.session.destroy((err) => {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/");
        }
    });
};