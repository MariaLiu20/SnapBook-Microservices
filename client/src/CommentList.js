import React from 'react';
import axios from 'axios';

// prop in order to inject data into a component
const CommentList = ({ comments, postId }) => {
  const renderedComments = comments.map((comment) => {
    
    const onSubmitUp = async (event) => {
      event.preventDefault();
      await axios.post(`http://localhost:4004/posts/${postId}/comments/${comment.id}/votes`, {
        vote: 'upvote'
      }); 
    };
    
    const onSubmitDown = async (event) => {
      event.preventDefault();
      await axios.post(`http://localhost:4004/posts/${postId}/comments/${comment.id}/votes`, {
        vote: 'downvote'
      });
    };

    return <div>
      <li key={comment.id}>{comment.content}</li>
      <li>Status: {comment.status}</li>
      <li>Vote Count: {comment.votes}</li>
      <div>
        <form onSubmit={onSubmitUp} style={{float: "left", padding: "5px"}}>
          <button class="btn btn-primary">Like</button>
        </form>
        <form onSubmit={onSubmitDown} style={{float: "left", padding: "5px"}}>
          <button class="btn btn-primary">Dislike</button>
        </form>
        <br></br>
        <br></br>
      </div>
    </div>
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
