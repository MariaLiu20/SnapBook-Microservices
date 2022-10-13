/**
 * Create a post. List all posts.
 */
import express from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = 4000;

// Middleware
app.use(logger('dev'));
app.use(express.json());            // parses HTTP req body into JSON object
app.use(cors());

const posts = {};                   // in-memory database

// intercepts GET requests
// endpoint '/posts' is going to return all posts
app.get('/posts', (req, res) => {
  res.send(posts);
});

// add a new post
// every post & comment needs a unique ID
app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  if (title === undefined) {
    res.status(400).json({
      message: "Missing title"
    });
    return;
  }
  posts[id] = {
    id,
    title,
  };

  // Send post req to event bus with type and data {}
  await axios.post('http://localhost:4005/events', {
    // TODO: make 'PostCreated' an object instead of a string
    // put in another .js file
    // define smth in there that represents a postcreated type and import it
    type: 'PostCreated',                    
    data: { 
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

// Receives events and prints out event type
app.post('/events', (req, res) => {
  console.log(req.body.type);
  res.send({});
});

app.listen(port, () => {
  console.log('Listening on port 4000');
});
