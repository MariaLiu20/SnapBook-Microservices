/**
 * This service is responsible for maintaining comment votes.
 * - must have an endpoint to receive an upvote/downvote on a comment.
 * - will store the comment votes and emit a CommentVoted event.
 */
import express from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = 4004;

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(cors());

// Store comment votes
const numVotesByCommentId = {};

// Adding a vote to comment of given ID from post of given ID
app.post('/posts/:pid/comments/:id/votes', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { vote } = req.body;
    if (vote === undefined) {
        res.status(400).json({
            message: "Missing vote"
        });
        return;
    }

    const voteValue = vote === "upvote" ? 1 : -1;
    if (numVotesByCommentId[id] === undefined) {
        numVotesByCommentId[id] = voteValue;
    } else{
        numVotesByCommentId[id] += voteValue;
    }

    await axios.post('http://localhost:4005/events', {
        // TODO: create object in separate .js file
        type: 'CommentVoted',
        data: {
            id,
            vote,
            postId: req.params.pid,
            commentId: req.params.id
        },
    });

   console.log("hi");
    res.status(201).send({});
    
});

app.post('/events', (req, res) => {
    console.log(req.body.type);
    res.send({});
});

app.listen(port, () => {
    console.log('Listening on 4004');
});