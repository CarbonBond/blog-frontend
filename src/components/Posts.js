import React, { useState, useRef } from "react"
import { Link } from 'react-router-dom'

export default function Post({ id, user }) {

  const [post, setPost] = useState({
    title: '',
    name: '',
    content: '',
    updated: new Date(),
    created: new Date(),
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
    if (post.hasFetched) return;
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
      let updated = new Date(postData.updatedAt);
      let created = new Date(postData.createdAt);

      setPost(() => {
        console.log(postData)
        return {
          title: postData.title,
          name: postData.name,
          content: postData.content,
          updated: updated,
          created: created,
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
      <p>{post.content.substring(0, 150) + '...'}</p>
      <div className="info">
        <div>Brandon Burge</div>
        <div>{post.created.toDateString()}</div>
        <div>{post.updated.toDateString()}</div>
      </div>
    </Link>
  )


}
