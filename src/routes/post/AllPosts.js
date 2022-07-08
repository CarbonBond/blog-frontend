import React, { useState } from "react"
import uniqid from 'uniqid';
import Post from '../../components/Posts.js'
import '../../css/allpost.css'
import { useOutletContext } from 'react-router-dom'

function Posts() {

  const [postList, setPostList] = useState({
    loading: true,
    posts: []
  })

  let user = useOutletContext()
  async function fetchData(url, token = "") {

    try {
      let response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
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
    if (user) {
      let parsedUser = JSON.parse(user)
      fetchData('https://blog-api.brandonburge.com/api/v/1/post?limit=post_id', parsedUser.token)
    } else {
      fetchData('https://blog-api.brandonburge.com/api/v/1/public/post?limit=post_id')
    }
  }

  if (!postList.posts || postList.posts.length === 0) {
    return <p>Blog Post Loading</p>
  } else {
    return (
      <div className="postContainer">
        {
          postList.posts.map(post => {
            return (
              <Post id={post.post_id} key={uniqid()} user={user} />
            )
          })
        }
      </div>
    )
  }

}

export default Posts
