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
        products : [
            //     {
            //     title : {
            //         type : String,
            //         required : true
            //     },
            //     price : {
            //         type : Number, 
            //         required : true
            //     }, 
            //     description : {
            //         type : String, 
            //     }, 
            //     image_link : {
            //         type : String, 
            //         required : true
            //     }
            // }
        ],
        totalPrice : {
            type : Number, 
            default : 0
        }
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

module.exports = mongoose.model('User', userSchema);
