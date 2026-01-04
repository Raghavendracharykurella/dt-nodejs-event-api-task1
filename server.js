const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'event_db';
const COLLECTION_NAME = 'events';

let db;
let eventsCollection;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(DB_NAME);
    eventsCollection = db.collection(COLLECTION_NAME);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Routes
app.get('/api/v3/app/events', async (req, res) => {
  try {
    const { id, type, limit, page } = req.query;
    
    if (id) {
      const event = await eventsCollection.findOne({ _id: new ObjectId(id) });
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      return res.json(event);
    }
    
    if (type === 'latest') {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 5;
      const skip = (pageNum - 1) * limitNum;
      
      const events = await eventsCollection
        .find({})
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limitNum)
        .toArray();
      
      const total = await eventsCollection.countDocuments();
      
      return res.json({
        events,
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      });
    }
    
    res.status(400).json({ message: 'Invalid query parameters' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/v3/app/events', async (req, res) => {
  try {
    const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;
    
    if (!name || !tagline || !schedule || !description || !moderator || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newEvent = {
      type: 'event',
      uid: req.body.uid || null,
      name,
      tagline,
      schedule,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank: parseInt(rigor_rank) || 0,
      attendees: [],
      createdAt: new Date()
    };
    
    const result = await eventsCollection.insertOne(newEvent);
    
    res.status(201).json({
      message: 'Event created successfully',
      eventId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/v3/app/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    
    const result = await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/v3/app/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    
    const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;
