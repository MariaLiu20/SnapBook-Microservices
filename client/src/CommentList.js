import React, { useState } from 'react';
import axios from 'axios';

// prop in order to inject data into a component
const CommentList = ({ comments, postId }) => {
  const renderedComments = comments.map((comment) => {
    const onSubmitUp = async (event) => {
      console.log("UPVOTED");
      event.preventDefault();
      await axios.post(`http://localhost:4004/posts/${postId}/comments/${comment.id}/votes`, {
        vote: 'upvote',
      });
    };
    const onSubmitDown = async (event) => {
      event.preventDefault();
      await axios.post(`http://localhost:4004/posts/${postId}/comments/${comment.id}/votes`, {
        vote: 'downvote',
      });
    };

    return <div>
      <li key={comment.id}>{comment.content}</li>
      Status: {comment.status}
      <br></br>
      Count: {comment.votes}
      <form onSubmit={onSubmitUp}>
        <button class="btn btn-primary">Like</button>
      </form>
      <form onSubmit={onSubmitDown}>
        <button class="btn btn-primary">Dislike</button>
      </form>
    </div>
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
