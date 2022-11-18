import React, { useState } from 'react';
import axios from 'axios';

// Prop ({postId}) - data coming from parent component, which will create CommentCreate component
type Props = {
  postId: number
}

const CommentCreate = ({ postId }: Props) => {
  const [content, setContent] = useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
      content,
    });

    setContent('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
          ></input>
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default CommentCreate;
