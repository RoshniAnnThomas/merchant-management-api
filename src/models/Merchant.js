const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
      minlength: [2, 'Shop name must be at least 2 characters long'],
      maxlength: [150, 'Shop name cannot exceed 150 characters']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, 'Please provide a valid phone number']
    },
    ownerName: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
      minlength: [2, 'Owner name must be at least 2 characters long'],
      maxlength: [100, 'Owner name cannot exceed 100 characters']
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, 'Registration number must be at least 3 characters long'],
      maxlength: [50, 'Registration number cannot exceed 50 characters']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      minlength: [5, 'Address must be at least 5 characters long'],
      maxlength: [500, 'Address cannot exceed 500 characters']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Merchant', merchantSchema);
