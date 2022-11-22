/**
 * Listen for CommentCreated events. 
 * When this event is received, scan the comment for banned words.
 * Generate a CommentModerated event which includes original comment info received from CommentCreated event and
 * extend it with a status property, which indicates if the commentw as accepted or rejected
 */
 import express, {Express, Request, Response} from 'express';
 import logger from 'morgan';
 //import cors from 'cors';
 import axios from 'axios';
 
 const app: Express = express();
 const port: number = 4003;
 
 // Middleware
 app.use(logger('dev'));
 app.use(express.json());            // parses HTTP req body into JSON object
 //app.use(cors());
 
 // Interface to define event types
 interface Event {
     type: "PostCreated" | "CommentCreated" | "CommentModerated" | "CommentVoted", 
     data: {}
 }
 interface CommentCreated extends Event {
     type: "CommentCreated",
     data: {
         id: string, 
         content: string,
         postId: string
     }
 }
 interface TypedRequestBody<T> extends Express.Request {
     body: T
 }
 // const isCommentCreated = (e: any): e is CommentCreated =>
 //     e.type === "CommentCreated" && ("data.id" in e) && ("data.content" in e) && ("data.postId" in e);
 //     //typeof(e.data.id) == "string" && typeof(e.data.content == "string") && typeof(e.data.postId) == "string";
 
 app.post('/events', async (req: TypedRequestBody<Event>, res) => {
     if (req.body.type == "CommentCreated") {
         const { id, content, postId } = (req.body as CommentCreated).data;
         const bannedWords = ['donald', 'trump', 'republican', 'rightist', 'crap'];
         let status = "accepted";
         let words = content.split(' ');
         words.forEach(word => {
             if (bannedWords.includes(word.toLowerCase())) {
                 status = "rejected";
             }
         });
 
         // Send post req to event bus with type and data {}
         await axios.post('http://eventbus:4005/events', {
             // TODO: make 'PostCreated' an object instead of a string
             // put in another .js file
             // define smth in there that represents a postcreated type and import it
             type: 'CommentModerated',                    
             data: { 
                 id,
                 content,
                 postId,
                 status
             },
         });
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