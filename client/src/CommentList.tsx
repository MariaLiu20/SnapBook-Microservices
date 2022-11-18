import React from 'react';
import axios from 'axios';

// prop in order to inject data into a component
export type Comment = {
  id: number,
  content: string,
  status: string,
  votes: number
};
type Props = {
  comments: Array<Comment>,
  postId: number
}

const CommentList = ({ comments, postId }: Props) => {
  const renderedComments = comments.map((comment) => {
    
    const onSubmitUp: React.FormEventHandler<HTMLFormElement> = async (event) => {
      event.preventDefault();
      await axios.post(`http://localhost:4004/posts/${postId}/comments/${comment.id}/votes`, {
        vote: 'upvote'
      }); 
    };
    
    const onSubmitDown: React.FormEventHandler<HTMLFormElement> = async (event) => {
      event.preventDefault();
      await axios.post(`http://localhost:4004/posts/${postId}/comments/${comment.id}/votes`, {
        vote: 'downvote'
      });
    };

    return <div>
      <li key={comment.id}>{comment.content}
        <div>Status: {comment.status}</div>
        <div>Vote Count: {comment.votes}</div>
        <div>
          <form onSubmit={onSubmitUp} style={{float: "left", padding: "5px"}}>
            <button className="btn btn-primary">Like</button>
          </form>
          <form onSubmit={onSubmitDown} style={{float: "left", padding: "5px"}}>
            <button className="btn btn-primary">Dislike</button>
          </form>
        </div>
        <br />
        <br />
      </li>
    </div>
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
