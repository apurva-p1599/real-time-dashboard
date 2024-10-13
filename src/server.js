const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/resourceDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema and model
const resourceSchema = new mongoose.Schema({
  resourceName: String,
  resourceAmount: Number,
  allocationDate: Date,
});

const Resource = mongoose.model('Resource', resourceSchema);

// Handle form submission
app.post('/allocate-resource', async (req, res) => {
  const { resourceName, resourceAmount, allocationDate } = req.body;

  try {
    const newResource = new Resource({
      resourceName,
      resourceAmount,
      allocationDate,
    });

    await newResource.save();
    res.status(200).json({ message: 'Resource allocated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to allocate resource' });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
