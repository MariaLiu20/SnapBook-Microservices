import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    return <div>
      <li key={comment.id}>{comment.content}</li>
      Status: {comment.status}
    </div>
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
