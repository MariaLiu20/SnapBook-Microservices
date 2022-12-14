/**
 * Populate post list with posts
 */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList, {Comment} from './CommentList';

type Post = {
  id: number,
  title: string,
  comments: Array<Comment>;
}

const PostList = () => {
  const [posts, setPosts] = useState(Array<Post>);

  const fetchPosts = async () => {
    // Get posts from query service
    const res = await axios.get('http://localhost:4002/posts');
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
          <CommentList comments={p.comments}
                        postId={p.id}></CommentList>
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
