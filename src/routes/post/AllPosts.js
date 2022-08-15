import React, { useEffect, useState } from 'react'
import uniqid from 'uniqid'
import Post from '../../components/Posts.js'
import '../../css/allpost.css'
import { useOutletContext } from 'react-router-dom'

function Posts() {
  const [postList, setPostList] = useState({
    loading: true,
    posts: [],
  })

  let cache = useOutletContext()
  let user = cache.user
  let posts = null;
  if (cache.posts) {
    posts = JSON.parse(cache.posts)
  }

  useEffect(() => {
    async function fetchData(url, token = '') {
      try {
        let response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        let posts = await response.json()
        setPostList({
          loading: false,
          posts: posts.reverse(),
        })
      } catch (err) {
        console.error(err)
      }
    }

    if (postList.loading) {
      if (user) {
        let parsedUser = JSON.parse(user)
        fetchData(
          'https://blog-api.brandonburge.com/api/v/1/post?limit=post_id',
          parsedUser.token
        )
      } else {
        fetchData(
          'https://blog-api.brandonburge.com/api/v/1/public/post?limit=post_id'
        )
      }
    }
  }, [postList.loading, user])

  if (posts && postList.loading) {
    return (
      <div className='postContainer'>
        {Object.keys(posts)
          .reverse()
          .map((key, index) => {
            return <Post id={key} key={uniqid()} cache={cache} />
          })}
      </div>
    )
  } else if (!postList.posts || postList.posts.length === 0) {
    return (
      <div className='postContainer'>
        <p>Blog Post Loading</p>
      </div>
    )
  } else {
    return (
      <div className='postContainer'>
        {postList.posts.map((post) => {
          return <Post id={post.post_id} key={uniqid()} cache={cache} />
        })}
      </div>
    )
  }
}

export default Posts
