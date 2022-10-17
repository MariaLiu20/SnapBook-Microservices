/**
 * Listen for CommentCreated events. 
 * When this event is received, scan the comment for banned words.
 * Generate a CommentModerated event which includes original comment info received from CommentCreated event and
 * extend it with a status property, which indicates if the commentw as accepted or rejected
 */
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import { TYPES } from '../types.js';

const app = express();
const port = 4003;

// Middleware
app.use(logger('dev'));
app.use(express.json());            // parses HTTP req body into JSON object
app.use(cors());

app.post('/events', async (req, res) => {
    const { type, data } = req.body;
    if (type === undefined || data === undefined || typeof type !== "string") {
        res.status(400).json({
            message: "Missing type or data"
        });
        return;
    }
    try {
        if (type == TYPES.CommentCreated) {
            const { id, content, postId } = data;
            const bannedWords = ['donald', 'trump', 'republican', 'rightist', 'crap'];
            let status = "accepted";
            let words = content.split(' ');
            words.forEach(word => {
                if (bannedWords.includes(word.toLowerCase())) {
                    status = "rejected";
                }
            });
            // Send post req to event bus with type and data {}
            await axios.post('http://localhost:4005/events', {
                type: TYPES.CommentModerated,                    
                data: { 
                    id,
                    content,
                    postId,
                    status
                },
            });
        }
        res.send({ status: 'OK' });
    } catch (err) {
        res.status(500).send({
            message: "INTERNAL SERVER ERROR"
        });
    }
});

app.post('/events', (req, res) => {
    console.log(req.body.type);
    res.send({});
  });
  
app.listen(port, () => {
    console.log('Listening on 4003');
  });