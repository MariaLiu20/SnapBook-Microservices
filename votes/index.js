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
import { TYPES } from '../types.js'

const app = express();
const port = 4004;

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(cors());

// Store comment's vote
const numVotesByCommentId = {};

// Adding a vote to comment of given ID from post of given ID
app.post('/votes', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { vote, postId, commentId } = req.body;
    if (vote === undefined) {
        res.status(400).json({
            message: "Missing vote"
        });
        return;
    }

    const voteValue = vote === "upvote" ? 1 : -1;
    if (numVotesByCommentId[commentId] === undefined){
        numVotesByCommentId[commentId] = voteValue;
    } else{
        numVotesByCommentId[commentId] += voteValue;
    }

    await axios.post('http://localhost:4005/events', {
        type: TYPES.CommentVoted,
        data: {
            id,
            vote,
            postId,
            commentId
        },
    });
    
    res.status(201).send({});
});

app.post('/events', (req, res) => {
    console.log(req.body.type);
    res.send({});
});

app.listen(port, () => {
    console.log('Listening on 4004');
});