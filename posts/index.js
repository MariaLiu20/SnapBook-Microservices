/**
 * Create a post. List all posts.
 */
import express from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';            // to generate events when creating post
import { TYPES } from '../types.js';

const app = express();
const port = 4000;

// Middleware
app.use(logger('dev'));
app.use(express.json());              // parses HTTP req body into JSON object
app.use(cors());

// in-memory database
const posts = {};                     

// Intercepts GET requests
// endpoint '/posts' is going to return all posts
app.get('/posts', (req, res) => {
  try {
    res.send(posts);
  } catch (err) {
    res.status(500).send({
      message: "INTERNAL SERVER ERROR"
    });
  }
});

// Create a new endpoint '/posts' to receive events
// every post & comment needs a unique ID
app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  // Missing title field
  if (title === undefined) {
    res.status(400).json({
      message: "Missing title"
    });
    return;
  }
  try {
    posts[id] = {
      id,
      title,
    };
  
    // Send post req to event bus to '/events' endpoint with type and data {}
    await axios.post('http://localhost:4005/events', {
      type: TYPES.PostCreated,                    
      data: { 
        id,
        title,
      },
    });
  
    res.status(201).send(posts[id]);
  } catch (err) {
    res.status(500).send({
      message: "INTERNAL SERVER ERROR"
    });
  }
});

// Receives events and prints out event type
app.post('/events', (req, res) => {
  console.log(req.body.type);
  res.send({});
});

app.listen(port, () => {
  console.log('Listening on port 4000');
});
