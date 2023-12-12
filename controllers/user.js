const Product = require("../models/product");

module.exports.GET_Home = (req,res,next) => {
    Product.find().then((products) => {
        res.render('user/home', {PageTitle : 'Home', logged_in : req.logged_in, user : req.user ,products: products});
    });
};
module.exports.GET_Shop = (req,res,next) => {
    res.render('user/shop', {PageTitle : 'Shop',logged_in : req.logged_in, user : req.user});
};
module.exports.GET_Card = (req,res,next) => {
    if(req.logged_in)
    {
        req.user.getCard((card) => {
            res.render('user/card', {PageTitle : 'Card', logged_in : req.logged_in, user : req.user ,products : card.products, totalPrice : card.totalPrice});
        });
    }
    else
    {
        res.redirect('/login');
    }
};
module.exports.GET_Orders = (req,res,next) => {
    if(req.logged_in)
    {
        req.user.getOrders((orders) => {
            res.render('user/orders', {PageTitle : 'Orders', logged_in : req.logged_in, user : req.user ,orders : orders}); 
        });
    }
    else
    {
        res.redirect("/login");
    }
};
module.exports.GET_Product_Details = (req,res,next) => {
    const productId = req.query.id;
    Product.findById(productId).then((product) => {
        res.render('user/product-details', {PageTitle : 'Details', logged_in : req.logged_in, user : req.user ,product: product});
    });
};
module.exports.POST_Add_To_Card = (req, res, next) => {
    if(req.logged_in)
    {
        const productId = req.params.productId;
        Product.findById(productId).then((product) => {
            req.user.addToCard(product, () => {
                res.redirect('/card');
            });
        });
    }
    else
    {
        res.redirect("/login");
    }
};
module.exports.POST_Delete_From_Card = (req, res, next) => {
    if(req.logged_in)
    {
        const productId = req.params.productId;
        req.user.deleteFromCard(productId, () => {
            res.redirect('/card');
        });
    }
    else
    {
        res.redirect("/login");
    }
};
module.exports.POST_Add_To_Order = (req, res, next) => {
    if(req.logged_in)
    {
        req.user.addToOrders(() => {
            res.redirect('/orders');
        });
    }
    else
    {
        res.redirect("/login");
    }
};

 