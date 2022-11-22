var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Listen for CommentCreated events.
 * When CommentCreated event is received, scan the content for banned words.
 * Generate a CommentModerated event which includes original comment info received from CommentCreated event and
 * extend it with a status property, which indicates if the comment was accepted or rejected
 */
import express from 'express';
import logger from 'morgan';
//import cors from 'cors';
import axios from 'axios';
const app = express();
const port = 4003;
// Middleware
app.use(logger('dev'));
app.use(express.json()); // parses HTTP req body into JSON object
app.post('/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.type == 'CommentCreated') {
        const { id, content, postId } = req.body.data;
        const bannedWords = ['donald', 'trump', 'republican', 'rightist', 'crap'];
        let status = 'accepted';
        let words = content.split(' ');
        words.forEach(word => {
            if (bannedWords.includes(word.toLowerCase())) {
                status = 'rejected';
            }
        });
        // Send post req to event bus with event type and data {}
        let commentModerated = {
            type: 'CommentModerated',
            data: {
                id,
                content,
                postId,
                status
            }
        };
        yield axios.post('http://eventbus:4005/events', commentModerated);
    }
    res.send({ status: 'OK' });
}));
app.post('/events', (req, res) => {
    console.log(req.body.type);
    res.send({});
});
app.listen(port, () => {
    console.log('Listening on 4003');
});
