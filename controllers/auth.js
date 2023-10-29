module.exports.getLogin = (req, res, next) => {
    res.render('auth/login', {PageTitle : 'Login'});
};  