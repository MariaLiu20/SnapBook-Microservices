/**
 * Populate post list with posts
 */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:4002/posts');
    // TODO: error checking
    setPosts(res.data);
  };

  // Takes in a function to invoke after some action
  // Is invoked when a state change occurs
  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map((p) => {
    return (
      <div
        className="card"
        style={{ width: '30%', marginBottom: '20px' }}
        key={p.id}                                          // needed every time you create a list in HTML
      >
        <div className="card-body">
          <h3>{p.title}</h3>
          <CommentList comments={p.comments} />
          <CommentCreate postId={p.id} />
        </div>
      </div>
    );
  });

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
};

export default PostList;
