const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  cuisine: { type: [String], required: true },
  googleMapsUrl: { type: String },
  image: { type: String },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  menuItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'newDish' // Reference to the newDish model
    }
  ],
  openingHours: {
    isOpen: { type: Boolean, default: false },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true }
  },
  phoneNumber: { type: String },
  priceLevel: { type: Number, min: 1, max: 5 },
  rating: { type: Number, min: 0, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
