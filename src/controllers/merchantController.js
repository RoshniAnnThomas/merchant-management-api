const mongoose = require('mongoose');
const Merchant = require('../models/Merchant');
const Category = require('../models/Category');

const formatValidationErrors = (error) => {
  return Object.values(error.errors).map((err) => err.message);
};

const createMerchant = async (req, res) => {
  try {
    const {
      shopName,
      phoneNumber,
      ownerName,
      registrationNumber,
      category,
      address
    } = req.body;

    if (
      !shopName ||
      !phoneNumber ||
      !ownerName ||
      !registrationNumber ||
      !category ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: 'All merchant fields are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const merchantExists = await Merchant.findOne({
      registrationNumber: registrationNumber.trim().toUpperCase()
    });

    if (merchantExists) {
      return res.status(409).json({
        success: false,
        message: 'Merchant registration number already exists'
      });
    }

    const merchant = await Merchant.create({
      shopName,
      phoneNumber,
      ownerName,
      registrationNumber,
      category,
      address
    });

    const populatedMerchant = await Merchant.findById(merchant._id).populate(
      'category',
      'name description'
    );

    return res.status(201).json({
      success: true,
      message: 'Merchant created successfully',
      data: populatedMerchant
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: formatValidationErrors(error)
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Merchant registration number already exists'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create merchant',
      error: error.message
    });
  }
};

const getMerchants = async (req, res) => {
  try {
    const merchants = await Merchant.find()
      .populate('category', 'name description')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: merchants.length,
      data: merchants
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch merchants',
      error: error.message
    });
  }
};

const getMerchantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid merchant ID'
      });
    }

    const merchant = await Merchant.findById(id).populate(
      'category',
      'name description'
    );

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: merchant
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch merchant',
      error: error.message
    });
  }
};

const updateMerchant = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid merchant ID'
      });
    }

    if (updates.category) {
      if (!mongoose.Types.ObjectId.isValid(updates.category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID'
        });
      }

      const categoryExists = await Category.findById(updates.category);

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    if (updates.registrationNumber) {
      updates.registrationNumber = updates.registrationNumber.trim().toUpperCase();

      const merchantExists = await Merchant.findOne({
        registrationNumber: updates.registrationNumber,
        _id: { $ne: id }
      });

      if (merchantExists) {
        return res.status(409).json({
          success: false,
          message: 'Merchant registration number already exists'
        });
      }
    }

    const merchant = await Merchant.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).populate('category', 'name description');

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Merchant updated successfully',
      data: merchant
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: formatValidationErrors(error)
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Merchant registration number already exists'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update merchant',
      error: error.message
    });
  }
};

const deleteMerchant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid merchant ID'
      });
    }

    const merchant = await Merchant.findByIdAndDelete(id);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Merchant deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete merchant',
      error: error.message
    });
  }
};

module.exports = {
  createMerchant,
  getMerchants,
  getMerchantById,
  updateMerchant,
  deleteMerchant
};
