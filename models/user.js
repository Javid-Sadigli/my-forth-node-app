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

module.exports = mongoose.model('User', userSchema);
