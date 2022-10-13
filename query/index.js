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
  // TODO: error checking
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId } = data;
    console.log(postId);
    const post = posts[postId];
    // if postId doesnt exist, post will be undefined
    if (post === undefined) {
      console.log("ERROR: CommentCreated")
      return;
    }
    post.comments.push({ id, content, status: "under_review", upvotes: 0, downvotes: 0 });
  }

  if (type === 'CommentModerated') {
    const { id, content, postId, status} = data;
    const post = posts[postId];
    // TODO: error checking
    for (let i = 0; i < post.comments.length; i++) {
      if (post.comments[i].id === id) {
        post.comments[i].status = status;
        //console.log(status);
        break;
      }
    }
    // for (comment of post.comments) {
    //   console.log(comment);
    //   if (comment.id === id) {
    //     comment.status = status;
    //     console.log(status);
    //     break;
    //   }
    // }
  }

  if (type === 'CommentVoted') {
    const {id, vote, postId, commentId} = data;
    const post = posts[postId];
    for (comment of post.comments) {
      if (comment.id === commentId) {
        if (vote === 'upvote')
          comment.upvotes++;
        else if (vote === 'downvote')
          comment.downvotes++;
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
