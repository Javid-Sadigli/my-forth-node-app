module.exports.GET_Login = (req, res, next) => {
    console.log(req.session);
    res.render('auth/login', {PageTitle : 'Login'});
};  
module.exports.POST_Login = (req, res, next) => {
    req.session.loggedIn = true;
    res.redirect('/');
};