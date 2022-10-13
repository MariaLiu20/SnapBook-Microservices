/**
 * Listen for CommentCreated events. 
 * When this event is received, scan the comment for banned words.
 * Generate a CommentModerated event which includes original comment info received from CommentCreated event and
 * extend it with a status property, which indicates if the commentw as accepted or rejected
 */
import express from 'express';

const app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());            // parses HTTP req body into JSON object

bannedWords = ['Donald', 'Trump', 'Republican', 'rightist', 'crap'];

app.post('/events', async (req, res) => {
    const { type, data } = req.body;
    let status = "accepted";

    if (type == 'CommentCreated') {
        let comment = data.content;
        let words = comment.split(' ');
        words.forEach(word => {
            if (bannedWords.includes(word)) {
                status = "rejected";
            }
        });
    }
    // Send post req to event bus with type and data {}
    await axios.post('http://localhost:4005/events', {
        // TODO: make 'PostCreated' an object instead of a string
        // put in another .js file
        // define smth in there that represents a postcreated type and import it
        type: 'CommentModerated',                    
        data: { 
            id: data.id,
            content: data.content,
            postId: data.postId,
            status
        },
    });
});