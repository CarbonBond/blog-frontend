import React, { useState } from "react"
import uniqid from 'uniqid';
import Header from '../components/Header.js'
import Post from '../components/Post.js'



function PostConatiner() { }

function Posts() {

  const [postList, setPostList] = useState({
    loading: true,
    posts: []
  })


  async function fetchData() {


    try {
      let response = await fetch('http://blog-api.brandonburge.com/api/v/1/public/post?limit=post_id');
      let posts = await response.json();
      setPostList({
        loading: false,
        posts: posts
      });

    } catch (err) {
      console.error(err)
    }
  }

  if (postList.loading) {
    fetchData()
  }

  if (!postList.posts || postList.posts.length === 0) {
    return <div>
      <Header />
      <p>Blog Post Loading</p>
    </div>
  } else {
    return (
      <div>
        <Header />
        <div className="postContainer">
          {
            postList.posts.map(post => {
              return (
                <Post id={post.post_id} key={uniqid()} />
              )
            })
          }
        </div>
      </div>
    )
  }

}

export default Posts
