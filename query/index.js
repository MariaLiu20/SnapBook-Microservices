/**
 * Accumulates events
 */
import express from 'express';
import cors from 'cors';

const app = express();
const port = 4002;

app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  if (type === undefined || data === undefined) {
    res.status(400).json({
      message: "Missing type or data"
    });
    return;
  }
  
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId } = data;
    const post = posts[postId];
    if (post === undefined) {
      console.log("CommentCreated ERROR: post does not exist")
      return;
    }
    post.comments.push({ id, content, status: "under_review", votes: 0 });
  }

  if (type === 'CommentModerated') {
    const { id, content, postId, status} = data;
    const post = posts[postId];
    if (post === undefined) {
      console.log("CommentModerated ERROR: post does not exist")
      return;
    }
    for (const comment of post.comments) {
      if (comment.id === id) {
        comment.status = status;
        break;
      }
    }
  }

  if (type === 'CommentVoted') {
    const {id, vote, postId, commentId} = data;
    console.log(vote);
    const post = posts[postId];
    if (post === undefined) {
      console.log("CommentVoted ERROR: post does not exist")
      return;
    }
    console.log("COMMENT VOTED");
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
});

app.listen(port, () => {
  console.log('Listening on 4002');
});
