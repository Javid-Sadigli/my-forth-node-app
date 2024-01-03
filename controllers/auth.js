const bcrypt = require("bcryptjs");

const User = require('../models/user');

module.exports.GET_Login = (req, res, next) => {
    if(!req.logged_in)
    {
        res.render('auth/login', {PageTitle : 'Login', error_message: req.flash('error')[0]});
    }
    else
    {
        next();
    }
};  
module.exports.POST_Login = (req, res, next) => {
    const email = req.body.email; 
    const password = req.body.password;
    let sessionUser;
    let response_sent = false;
    User.findOne({
        email : email
    }).then((user) => {
        if(user)
        {
            sessionUser = user;
            return bcrypt.compare(password, user.password);
        }
        else
        {
            req.flash('error', 'Invalid email or password!');
            response_sent = true; 
            res.redirect("/login");
        }
    }).then((isMatching) => {
        if(isMatching)
        {
            req.session.user = sessionUser;
            res.redirect('/');
        }
        else if(!response_sent)
        {
            req.flash('error', 'Invalid email or password!');
            res.redirect('/login');
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

module.exports.GET_Register = (req, res, next) => {
    if(!req.logged_in)
    {
        res.render("auth/register", {PageTitle : "Register", error_message : req.flash('error')[0]});
    }
    else
    {
        next();
    }
};

module.exports.POST_Register = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;
    const username = req.body.username;

    if(password == confirm_password)
    {
        User.findOne({email: email}).then((user) => {
            if(user)
            {
                req.flash('error', 'We have a user with this email. Try another one!'); 
                res.redirect('/register');
            }
            else
            {
                return bcrypt.hash(password, 12);
            }
        }).then((password) => {
            if(password)
            {
                const newUser = new User({
                    email : email,
                    password : password,
                    username : username
                });
                return newUser.save();
            }
        }).then((the_user) => {
            if(the_user)
            {
                res.redirect('/');
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    else
    {
        req.flash('error', 'Your passwords doesn\'t match!');
        res.redirect('/register');
    }
};