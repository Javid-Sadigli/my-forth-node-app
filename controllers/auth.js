const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const SendGridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(SendGridTransport({auth : {
    api_key : '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' 
}}));

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
                transporter.sendMail({
                    to : email, 
                    from : 'duaedenspiderman@gmail.com', 
                    subject : 'Successfully registered.', 
                    html : '<h1>Successfully registered</h1>'
                });
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

module.exports.GET_Reset = (req, res, next) => {
    res.render('auth/reset', {PageTitle : 'Reset Password', error_message : req.flash('error')[0]});
};
module.exports.POST_Reset = (req, res, next) => {
    const email = req.body.email;
    let response_sent = false;
    crypto.randomBytes(32, (err, buffer) => {
        if(err)
        {
            console.log(err);
            response_sent = true;
            res.redirect('/reset');
        }
        else
        {
            const token = buffer.toString('hex');
            User.findOne({email : email}).then((user) => {
                if(!user)
                {
                    req.flash('error', 'User not found! Enter a valid email address!');
                    response_sent = true;
                    res.redirect('/reset');
                }
                else
                {
                    user.setResetToken(token, () => {
                        req.flash('email', email);
                        res.redirect('/reset/info');
                        transporter.sendMail({
                            to : email, 
                            from : 'duaedenspiderman@gmail.com', 
                            subject : 'Reset your password.', 
                            html : `
                                <p> Please go to the following link to reset your password. </p>
                                <a href="http://localhost:3000/reset/token/${token}">Click here</a>
                        `});

                    });
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    });
};

module.exports.GET_Reset_Info = (req, res, next) => {
    const email = req.flash('email')[0];
    if(email)
    {
        res.render('auth/resetInfo', {PageTitle : 'Info', email : email});
    }
    else
    {
        next();
    }
};

module.exports.GET_Reset_Token = (req, res, next) => {
    const token = req.params.reset_token; 
    let response_sent = false;
    User.findOne({
        'resetToken.token' : token, 
        'resetToken.expirationDate' : {$gt : Date.now()}
    }).then((user) => {
        if(user)
        {
            res.render('auth/resetForm', {PageTitle : 'Reset Password', error_message : req.flash('error')[0], user_id : user._id});
        }
        else
        {
            response_sent = true;
            next();
        }
    }).catch((err) => {
        console.log(err);
    });
};

module.exports.POST_Reset_Password = (req, res, next) => {
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;
    const user_id = req.body.user_id;
    let response_sent = false;
    let resetUser;

    User.findOne({
        _id : user_id, 
        'resetToken.expirationDate' : {$gt : Date.now()}
    }).then((user) => {
        if(password == confirm_password)
        {
            resetUser = user;
            return bcrypt.hash(password, 12);
        }
        else
        {
            req.flash('error', 'Your passwords doesn\'t match!'); 
            response_sent = true;
            res.redirect(`/reset/token/${user.resetToken.token}`);
        }
    }).then((hashed_password) => {
        if(hashed_password)
        {
            resetUser.password = hashed_password;
            resetUser.resetToken = undefined;
            return resetUser.save();
        }
    }).then(() => {
        if(!response_sent)
        {
            res.redirect('/login');
        }
    }).catch((err) => {
        console.log(err);
    });
};