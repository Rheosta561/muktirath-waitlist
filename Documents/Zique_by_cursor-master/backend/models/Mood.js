const mongoose = require ('mongoose');
const MoodSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId},
    meal : {type: [String] , required : false},
    flavour :{ type: [String]},
    feel :{ type: [String]},
    method : {type: [String]},
    calorie:{type: Number},
    protein:{type: Number},
    fats:{
        type: Number
    },
    carbs:{
        type: Number
    },
    fit:{type: Boolean ,default:true},
});

module.exports = mongoose.model("Mood", MoodSchema);