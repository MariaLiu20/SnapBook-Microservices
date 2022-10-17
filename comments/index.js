import express from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';
import { TYPES } from '../types.js';

const app = express();
const port = 4001;

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(cors());

// in-memory database
const commentsByPostId = {};

// Given a post ID...
app.get('/posts/:id/comments', (req, res) => {
  try {
    res.send(commentsByPostId[req.params.id] || []);
  } catch (err) {
    res.status(500).send({
      message: "INTERNAL SERVER ERROR"
    });
  }
});

// Adding a comment to post of given ID
app.post('/posts/:id/comments', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { content } = req.body;
  // Missing content field
  if (content === undefined) {
    res.status(400).json({
      message: "Missing content"
    });
    return;
  }
  try {
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id, content }); 
    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
      type: TYPES.CommentCreated,
      data: {
        id,
        content,
        postId: req.params.id,
      },
    });

    res.status(201).send(comments);
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
  console.log('Listening on 4001');
});
