const mongoose = require('mongoose');
const PalateSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId},
    diet : {type:[String]},
    allergies : {type:[String]},
    cuisine :{type :[String]},
    staple :{type :[String]},
    dislikes : {type :[String]}
    
});

module.exports = mongoose.model('Palate', PalateSchema);