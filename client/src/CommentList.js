import React from 'react';

// prop in order to inject data into a component
const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    return <div>
      <li key={comment.id}>{comment.content}</li>
      Status: {comment.status}
      <button class="btn btn-primary">Submit</button>
    </div>
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
