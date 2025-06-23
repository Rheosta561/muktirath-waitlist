const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.URI;

const conn = async()=>{
    try {
         await mongoose.connect(URI);
         console.log('mongoose connected');
        
    } catch (error) {
        console.log('error in connection ' , error);
        
    }
   

}

module.exports = {conn};