const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const user = require('./Models/user');
const cors = require('cors');
const {conn} = require('./connection');
conn();
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors());



app.get('/' , (req,res)=>{
    res.send('working');
})

app.post('/signup' , async(req,res)=>{
    try {
        console.log('hit');
        const {email} = req.body;
    const createdUser = await user.create({
        email

    });

    const token = jwt.sign({_id: createdUser._id , email:createdUser.email}  , 'secret');

    res.status(200).json({
        message:"Thank You For Joining The Waitlist , We'll Notify As soon As we are Live",
        token
    })
        
    } catch (error) {
        console.log(error);

        res.status(500).json({error:error.message});
        
    }
    
});
const port = process.env.PORT || 3000

app.listen(port , ()=>{
    console.log('Server is up and running on port 3000');

});