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
    const post = posts[postId];
    post.comments.push({ id, content, status: "under_review" });
  }

  if (type === 'CommentModerated') {
    const { id, content, postId, status} = data;
    const post = posts[postId];
    // Loop post.comments for id and set its status to status
    for (comment of post.comments) {
      if (comment.id == id) {
        comment.status = status;
        console.log(status);
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
