const mongoose = require('mongoose');

const newDishSchema = mongoose.Schema({
    name:{type:String},
    category:{type:[String] },
    diet:{type:[String]},
    ingredients:{type:[String]},
    cuisine:{type:[String]},
    allergens:{type:[String]},
    feel:{type:[String]},
    flavor:{type:[String]},
    calorie:{type:Number},
    protein:{type:Number},
    fats:{type:Number},
    carbs:{type:Number},
    description:{type:String},
    image:{type:String},
      restaurant_id: {type:mongoose.Schema.Types.ObjectId},
        restaurant_name:{type:String},
        price:{type:Number}
});

module.exports = mongoose.model('newDish' , newDishSchema);