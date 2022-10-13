import React, { useState } from 'react';
import axios from 'axios';                // used to communicate to a back-end service

const PostCreate = () => {
  // State: title
  // Function: setTitle
  const [title, setTitle] = useState('');               // "hook"
  
  // To make a post request to an endpoint passing the form data to that endpoint.
  const onSubmit = async (event) => {                   // async fn = http request
    event.preventDefault();                             // default: form submissions reload the page

    await axios.post('http://localhost:4000/posts', {
      title,
    });

    setTitle('');                                       // reset
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title: {title}</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}  // {event handler}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default PostCreate;
