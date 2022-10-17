/**
 * Accumulates events
 */
import express from 'express';
import cors from 'cors';
import { TYPES } from '../types.js';

const app = express();
const port = 4002;

app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  try {
    res.send(posts);
  } catch (err) {
    res.status(500).send({
      message: "INTERNAL SERVER ERROR"
    });
  }
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  if (type === undefined || data === undefined || typeof type !== "string") {
    res.status(400).json({
      message: "Missing type or data"
    });
    return;
  }
  try {
    if (type === TYPES.PostCreated) {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
    }

    if (type === TYPES.CommentCreated) {
      const { id, content, postId } = data;
      const post = posts[postId];
      if (post === undefined) {
        res.status(404).json({
          message: "CommentCreated ERROR: post does not exist"
        });
        return;
      }
      post.comments.push({ id, content, status: "under_review", votes: 0 });
    }
  
    if (type === TYPES.CommentModerated) {
      const { id, content, postId, status} = data;
      const post = posts[postId];
      if (post === undefined) {
        res.status(404).json({
          message: "CommentModerated ERROR: post does not exist"
        });
        return;
      }
      for (const comment of post.comments) {
        if (comment.id === id) {
          comment.status = status;
          break;
        }
      }
    }
  
    if (type === TYPES.CommentVoted) {
      const {id, vote, postId, commentId} = data;
      const post = posts[postId];
      if (post === undefined) {
        res.status(404).json({
          message: "CommentVoted ERROR: post does not exist"
        });
        return;
      }
      for (const comment of post.comments) {
        if (comment.id === commentId) {
          if (vote === 'upvote')
            comment.votes++;
          else if (vote === 'downvote')
            comment.votes--;
          break;
        }
      }
    }
  
    console.log(posts);
    res.send({ status: 'OK' });
  } catch (err) {
    res.status(500).send({
      message: "INTERNAL SERVER ERROR"
    });
  }
});

app.listen(port, () => {
  console.log('Listening on 4002');
});
