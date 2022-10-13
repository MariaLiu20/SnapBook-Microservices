import express from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = 4001;

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(cors());

// Store comments
const commentsByPostId = {};

// Given a post ID...
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// Adding a comment to post of given ID
app.post('/posts/:id/comments', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { content } = req.body;
  if (content === undefined) {
    res.status(400).json({
      message: "Missing content"
    });
    return;
  }
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id, content }); 
  commentsByPostId[req.params.id] = comments;

  await axios.post('http://localhost:4005/events', {
    // TODO: create object in separate .js file
    type: 'CommentCreated',
    data: {
      id,
      content,
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

app.post('/events', (req, res) => {
  console.log(req.body.type);
  res.send({});
});

app.listen(port, () => {
  console.log('Listening on 4001');
});
