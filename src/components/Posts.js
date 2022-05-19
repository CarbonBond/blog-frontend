import React, { useState, useRef } from "react"
import { Link } from 'react-router-dom'

export default function Post({ id, user }) {

  const [post, setPost] = useState({
    title: '',
    content: '',
    updated: null,
    created: null,
    hasFetched: false,
  })

  const postRef = useRef(null);

  const isInView = () => {
    const top = postRef.current.getBoundingClientRect().top;
    const windowEdge = window.innerHeight || document.documentElement.clientHeight;
    const offset = windowEdge * 0.5;
    return top <= windowEdge + offset
  }

  const fetchData = async (URL, token) => {
    try {
      let response = await fetch(
        URL,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      let postData = await response.json();
      setPost(prevPost => {
        return {
          title: postData.title,
          content: postData.content,
          updated: Date.parse(postData.updatedAt),
          created: Date.parse(postData.createdAt),
          hasFetched: true
        }
      })

    } catch (err) {
      console.log(err)
    }
  }

  if (isInView && !post.hasFetched) {
    scrollHandler()
  }
  window.addEventListener('scroll', scrollHandler)


  function scrollHandler() {
    if (user) {
      let parsedUser = JSON.parse(user);
      fetchData(`http://blog-api.brandonburge.com/api/v/1/post/${id}`, parsedUser.token)
    } else {
      fetchData(`http://blog-api.brandonburge.com/api/v/1/public/post/${id}`, "")
    }

    window.removeEventListener('scroll', scrollHandler)
  }

  return (
    <Link to={`/post/${id}`} key={id} className="postList">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div>
        <div>{post.created}</div>
        <div>{post.updated}</div>
      </div>
    </Link>
  )


}
