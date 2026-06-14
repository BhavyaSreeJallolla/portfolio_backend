const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// @route   POST api/contact
// @desc    Submit a contact form message
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields (name, email, subject, message).',
    });
  }

  // Simple email regex validation
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    });
  }

  try {
    // Check if database is connected before trying to save
    const dbState = Message.db.readyState;
    if (dbState !== 1) { // 1 means connected
      console.warn('Database not connected. Simulating message save.');
      // Return a simulated success response for local dev if MongoDB isn't running
      return res.status(200).json({
        success: true,
        message: 'Message received! (Note: Running in offline mock database mode)',
        data: { name, email, subject, message, createdAt: new Date() }
      });
    }

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    });
  } catch (error) {
    console.error('Error saving message:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while sending your message. Please try again later.',
      error: error.message,
    });
  }
});

// @route   GET api/contact
// @desc    Retrieve all messages (for admin/dev convenience)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const dbState = Message.db.readyState;
    if (dbState !== 1) {
      return res.status(200).json({
        success: true,
        message: 'DB offline. Mock list returned.',
        messages: []
      });
    }

    const messages = await Message.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving messages.',
      error: error.message,
    });
  }
});

module.exports = router;
