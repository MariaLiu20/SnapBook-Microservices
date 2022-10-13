import React, { useState } from 'react';
import axios from 'axios';

const PostCreate = () => {
  // State: title
  // Function: setTitle
  const [title, setTitle] = useState('');               // "hook"
  // async fn = http request
  const onSubmit = async (event) => {
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
