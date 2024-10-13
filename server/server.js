const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Options - Allow requests from your React app on localhost:3000
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only requests from localhost:3000
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
  preflightContinue: false,
  optionsSuccessStatus: 204, // For legacy browser support
};

// Middleware
app.use(cors(corsOptions)); // Use CORS with the defined options
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Define a Resource Schema
const resourceSchema = new mongoose.Schema({
  resourceName: String,
  resourceType: String,
  quantity: Number,
  unitOfMeasurement: String,
  location: String,
  allocationDate: Date,
  allocatedBy: String,
  allocatedTo: String,
  purpose: String,
  priorityLevel: String,
});

// Create a Resource Model
const Resource = mongoose.model('Resource', resourceSchema);

// API Endpoint to handle resource allocation
app.post('/allocate-resource', async (req, res) => {
  const {
    resourceName,
    resourceType,
    quantity,
    unitOfMeasurement,
    location,
    allocationDate,
    allocatedBy,
    allocatedTo,
    purpose,
    priorityLevel,
  } = req.body;

  try {
    const newResource = new Resource({
      resourceName,
      resourceType,
      quantity,
      unitOfMeasurement,
      location,
      allocationDate,
      allocatedBy,
      allocatedTo,
      purpose,
      priorityLevel,
    });

    await newResource.save();
    res.status(201).json({ message: 'Resource allocated successfully' });
  } catch (error) {
    console.error('Error saving resource:', error);
    res.status(500).json({ message: 'Failed to allocate resource' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
