/**
 * Listen for CommentCreated events. 
 * When CommentCreated event is received, scan the content for banned words.
 * Generate a CommentModerated event which includes original comment info received from CommentCreated event and
 * extend it with a status property, which indicates if the comment was accepted or rejected
 */
import express, { Express, Request, Response } from 'express';
import logger from 'morgan';
//import cors from 'cors';
import axios from 'axios';

const app: Express = express();
const port: number = 4003;

// Middleware
app.use(logger('dev'));
app.use(express.json());            // parses HTTP req body into JSON object
//app.use(cors());

// Interfaces/types to define events
interface TypedRequestBody<T> extends Express.Request {
    body: T
}
interface Event {
    type: "PostCreated" | "CommentCreated" | "CommentModerated" | "CommentVoted",
    data: {}
}
type CommentCreated = {
    type: "CommentCreated",
    data: {
        id: string,
        content: string,
        postId: string
    }
} & Event;
type CommentModerated = {
    type: "CommentModerated",
    data: {
        id: string,
        content: string,
        postId: string,
        status: string
    }
} & Event

app.post('/events', async (req: TypedRequestBody<Event>, res: Response) => {
    if (req.body.type == 'CommentCreated') {
        const { id, content, postId } = (req.body as CommentCreated).data;

        const bannedWords = ['donald', 'trump', 'republican', 'rightist', 'crap'];
        let status = 'accepted';
        let words = content.split(' ');
        words.forEach(word => {
            if (bannedWords.includes(word.toLowerCase())) {
                status = 'rejected';
            }
        });
        // Send post req to event bus with event type and data {}
        let commentModerated: CommentModerated = {
            type: 'CommentModerated',
            data: {
                id,
                content,
                postId,
                status
            }
        };
        await axios.post('http://eventbus:4005/events', commentModerated);
    }
    res.send({ status: 'OK' });
});

app.post('/events', (req, res) => {
    console.log(req.body.type);
    res.send({});
});

app.listen(port, () => {
    console.log('Listening on 4003');
});