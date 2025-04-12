const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurantSchema');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Dish = require('../models/newDish');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; 

// Email transporter setup (replace with your credentials)
const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            // Show debug output
        });

// Helper to calculate if the restaurant is currently open
function isCurrentlyOpen(openTime, closeTime) {
  const now = new Date();
  const currentTime = now.getHours() + now.getMinutes() / 60;

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours + (minutes || 0) / 60;
  };

  const open = parseTime(openTime);
  const close = parseTime(closeTime);
  return currentTime >= open && currentTime <= close;
}

// POST /create-restaurant
router.post('/create-restaurant', async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      cuisine,
      googleMapsUrl,
      image,
      location,
      openingHours,
      phoneNumber,
      priceLevel,
      rating,
      email
    } = req.body;

    // Check if username already exists
    const existing = await Restaurant.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already taken' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Calculate isOpen
    const isOpen = isCurrentlyOpen(openingHours.openTime, openingHours.closeTime);

    // Create restaurant
    const newRestaurant = new Restaurant({
      name,
      username,
      password: hashedPassword,
      cuisine,
      googleMapsUrl,
      image,
      location,
      openingHours: {
        isOpen,
        openTime: openingHours.openTime,
        closeTime: openingHours.closeTime
      },
      phoneNumber,
      priceLevel,
      rating,
      email
    });

    await newRestaurant.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Our Platform!',
      html: `
        <h2>🎉 Welcome, ${name}!</h2>
        <p>Your restaurant has been successfully onboarded on our platform.</p>
        <p>We’re thrilled to have you serve your amazing dishes through us.</p>
        <br>
        <p>Cheers,<br>Team Zique</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Restaurant created and confirmation email sent', restaurant: newRestaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating restaurant', error: err.message });
  }
});

// routes/restaurantRoutes.js
 // adjust path as needed
 // path to your dish schema

// PUT /api/restaurants/:id
router.put('/restaurants/:id', async (req, res) => {
    try {
      const restaurantId = req.params.id;
  
      const {
        name,
        cuisine,
        googleMapsUrl,
        image,
        location,
        openingHours,
        phoneNumber,
        priceLevel,
        rating,
        menuItems
      } = req.body;
  
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
  
      // Update restaurant fields
      if (name) restaurant.name = name;
      if (cuisine) restaurant.cuisine = cuisine;
      if (googleMapsUrl) restaurant.googleMapsUrl = googleMapsUrl;
      if (image) restaurant.image = image;
      if (location) restaurant.location = location;
      if (openingHours) restaurant.openingHours = openingHours;
      if (phoneNumber) restaurant.phoneNumber = phoneNumber;
      if (priceLevel) restaurant.priceLevel = priceLevel;
      if (rating) restaurant.rating = rating;
  
      await restaurant.save();
  
      // 🧠 Track incoming and existing dish IDs
      const incomingDishIds = [];
      const existingDishes = await Dish.find({ restaurant_id: restaurantId });
  
      if (Array.isArray(menuItems)) {
        for (const item of menuItems) {
          if (item._id) {
            // Update existing dish
            const updatedDish = await Dish.findOneAndUpdate(
              { _id: item._id, restaurant_id: restaurant._id },
              { ...item },
              { new: true }
            );
            incomingDishIds.push(item._id);
          } else {
            // Create new dish
            const newDish = new Dish({
              ...item,
              restaurant_id: restaurant._id,
              restaurant_name: restaurant.name
            });
            await newDish.save();
            restaurant.menuItems.push(newDish._id);
            incomingDishIds.push(newDish._id.toString());
          }
        }
  
        await restaurant.save();
      }
  
      // 🗑️ Delete dishes that are no longer present
      const existingDishIds = existingDishes.map(dish => dish._id.toString());
      const dishesToDelete = existingDishIds.filter(id => !incomingDishIds.includes(id));
  
      if (dishesToDelete.length > 0) {
        await Dish.deleteMany({ _id: { $in: dishesToDelete } });
  
        // Also remove them from restaurant.menuItems
        restaurant.menuItems = restaurant.menuItems.filter(id => !dishesToDelete.includes(id.toString()));
        await restaurant.save();
      }
  
      res.status(200).json({ message: 'Restaurant and menu updated (with deletions).' });
  
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  });

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // 1. Check for required fields
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }
  
      // 2. Find the restaurant by username
      const restaurant = await Restaurant.findOne({ username });
      if (!restaurant) {
        return res.status(401).json({ message: 'Invalid username or password.' });
      }
  
      // 3. Compare passwords
      const isMatch = await bcrypt.compare(password, restaurant.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password.' });
      }
  
      // 4. Generate JWT token
      const token = jwt.sign(
        { id: restaurant._id, username: restaurant.username },
        JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.status(200).json({
        message: 'Login successful',
        token,
       restaurant ,
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Server error during login.' });
    }
  });

  router.get('/restaurant/:id', async (req, res) => {
    try {
      const restaurantId = req.params.id;
      const restaurant = await Restaurant.findById(restaurantId).populate('menuItems');
  
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      res.status(200).json({ restaurant });
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  );

  router.delete('/restaurant/dish/:id', async (req, res) => {
    const dishId = req.params.id;
    try {
      const dish = await Dish.findById(dishId);
      if(!dish){
        return res.status(404).json({message: 'Dish not found'});
      }
      await Dish.deleteOne({_id: dishId});
      res.status(200).json({message: 'Dish deleted successfully'});
      
    } catch (error) {
      console.error('Error deleting dish:', error);
      res.status(500).json({message: 'Server error'});
    }
  
  });

  const moment = require('moment'); 

  router.get('/allRestaurants', async (req, res) => {
    try {
      const restaurants = await Restaurant.find().populate('menuItems');
      const currentTime = moment();
  
      for (const restaurant of restaurants) {
        const { openTime, closeTime } = restaurant.openingHours;
  
        const openMoment = moment(openTime, "h:mm A");
        const closeMoment = moment(closeTime, "h:mm A");
  
        let isOpen;
  
        // Handle overnight timing like 22:00 to 06:00
        if (closeMoment.isBefore(openMoment)) {
          isOpen = currentTime.isAfter(openMoment) || currentTime.isBefore(closeMoment);
        } else {
          isOpen = currentTime.isBetween(openMoment, closeMoment);
        }
  
        // Update the isOpen field in DB only if it changed
        if (restaurant.openingHours.isOpen !== isOpen) {
          restaurant.openingHours.isOpen = isOpen;
          await restaurant.save();
        }
      }
  
      const updatedRestaurants = await Restaurant.find().populate('menuItems');
      res.status(200).json({ restaurants: updatedRestaurants });
  
    } catch (error) {
      return res.status(500).json({ message: 'Server busy', error: error.message });
    }
  });
  
  

  router
  




module.exports = router;
