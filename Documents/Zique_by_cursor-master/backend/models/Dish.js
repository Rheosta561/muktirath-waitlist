const mongoose = require('mongoose');

const dishScema = mongoose.Schema({
    category : {type:String , default:'general'},
    name : {type:String },
    ingredients: {type:[String]},
    description:{type:String},
    calories:{type:Number},
    protein:{type:Number},
    carbs:{type:Number},
    fats:{type:Number},
    price:{type:Number},
    vegan:{type:String},
    vegetarian:{type:String},
    Gluten_Free:{type:String},
    Non_Vegetarian:{type:String},
    Jain:{type:String},
    Keto:{type:String},
    cuisine:{type:String},




    flavor:{type:[String]},
    feel:{type:[String]},
    restaurant_id: {type:mongoose.Schema.Types.ObjectId},
    restaurant_name:{type:String}

})

module.exports= mongoose.model('Dish',dishScema);