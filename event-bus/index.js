/**
 * Internal event broker system
 * Manages event messages between services.
 */
import express from 'express';
import logger from 'morgan';
import axios from 'axios';

const app = express();
const port = 4005;

app.use(logger('dev'));
app.use(express.json());

app.post('/events', (req, res) => {
  const event = req.body;
  console.log(event);
  
  axios.post('http://localhost:4000/events', event).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://localhost:4001/events', event).catch((err) => {
    console.log(err.message);
  });
  
  axios.post('http://localhost:4002/events', event).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://localhost:4003/events', event).catch((err) => {
    console.log(err.message);
  }); 
  axios.post('http://localhost:4004/events', event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: 'OK' });
});

app.listen(port, () => {
  console.log('Listening on 4005');
});
