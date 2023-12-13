const ConsoleController = require('./console');

const Product = require("../models/product");

module.exports.GET_Add_Product = (req, res, next) => {
    res.render('admin/add-product', {PageTitle : 'Add Product', logged_in : req.logged_in, user : req.user});
};

module.exports.POST_Add_Product = (req, res, next) => {
    const product = new Product({
        title : req.body.title,
        price : req.body.price, 
        description : req.body.description, 
        image_link : req.body.image_link,
        userId : req.user._id
    });
    product.save().then(() => {
        console.log('Product saved successfully');
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log(err);
    });
};

module.exports.GET_Products = (req, res, next) => {
    Product.find().then((products) => {
        res.render('admin/products', {PageTitle : 'Products', products: products, logged_in : req.logged_in, user : req.user});
    });
};
module.exports.POST_Delete_Product = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByIdAndRemove(productId).then(() => {
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log(err);
    });
};
module.exports.GET_Edit_Product = (req, res, next) => {
    const productId = req.query.id;
    Product.findById(productId).then((product) => {
        res.render('admin/edit-product', {PageTitle : 'Edit Product', product: product, logged_in : req.logged_in, user : req.user});
    });
};
module.exports.POST_Edit_Product = (req, res, next) => {
    Product.findById(req.body.id).then((product) => {
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image_link = req.body.image_link;
        return product.save();
    }).then(() => {
        console.log("Product updated successfully");
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log(err);
    });
};