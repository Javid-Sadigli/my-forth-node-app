const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Product = require('./product');

const userSchema = new Schema({
    username : {
        type : String,
        required : true
    }, 
    email : {
        type : String,
        required : true
    }, 
    password : {
        type : String,
        required : true
    },
    card : {
        products : {
            type : Array, 
            default : []
        },
        totalPrice : {
            type : Number, 
            default : 0
        }
    }, 
    orders : {
        type : Array, 
        default : []
    }, 
    resetToken : {
        token : String,
        expirationDate : Date
    }
});

userSchema.methods.addToCard = function(product, CALLBACK_FUNCTION) 
{
    let updatedCard = this.card;
    let existing_product_index;
    let _product = {...(product._doc)};
    existing_product_index = updatedCard.products.findIndex(prod => prod._id.toString() == _product._id.toString());
    if(existing_product_index >= 0)
    {
        updatedCard.products[existing_product_index].amount++;
    }
    else
    {
        _product.amount = 1;
        updatedCard.products.push(_product);
    }
    updatedCard.totalPrice = (parseFloat(updatedCard.totalPrice) + parseFloat(_product.price)).toFixed(2);
    this.card = updatedCard;
    this.save().then(() => {
        CALLBACK_FUNCTION();
    }).catch((err) => {
        console.log(err);
    });
};

userSchema.methods.getCard = function(CALLBACK_FUNCTION)
{
    CALLBACK_FUNCTION(this.card);
};

userSchema.methods.deleteFromCard = function(productId,CALLBACK_FUNCTION)
{
    const deleting_product_index = this.card.products.findIndex(product => product._id.toString() == productId.toString());
    const deleting_product = this.card.products[deleting_product_index];

    this.card.products.splice(deleting_product_index, 1);

    this.card.totalPrice = parseFloat(this.card.totalPrice) - (parseFloat(deleting_product.price) * parseFloat(deleting_product.amount));

    this.save().then(() => {
        CALLBACK_FUNCTION();
    }).catch((err) => {
        console.log(err);
    });
};

userSchema.methods._empty_card = function(CALLBACK_FUNCTION)
{
    this.card = {
        totalPrice : 0,
        products : []
    };
    this.save().then(() => {
        CALLBACK_FUNCTION();
    }).catch((err) => {
        console.log(err);
    });
};

userSchema.methods.addToOrders = function(CALLBACK_FUNCTION)
{
    this.getCard((card) => {
        this.orders.push(card);
        this.save().then(() => {
            this._empty_card(CALLBACK_FUNCTION);
        });
    });
};

userSchema.methods.getOrders = function(CALLBACK_FUNCTION)
{
    CALLBACK_FUNCTION(this.orders);
};

userSchema.methods.setResetToken = function(token, CALLBACK_FUNCTION)
{
    this.resetToken = {
        token : token, 
        expirationDate : Date.now() + 3600000
    }; 
    this.save().then(() => {
        CALLBACK_FUNCTION();
    });
};

userSchema.methods.emptyResetToken = function(CALLBACK_FUNCTION)
{
    this.resetToken = {
        token : undefined, 
        expirationDate : undefined
    };
    this.save().then(() => {
        CALLBACK_FUNCTION();
    });
};


module.exports = mongoose.model('User', userSchema);
