import React, { useState, useRef } from "react"

export default function Post({ id }) {

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

  const fetchData = async () => {
    try {
      let response = await fetch(`http://blog-api.brandonburge.com/api/v/1/public/post/${id}`);
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
    if (isInView && !post.hasFetched) {
      fetchData()
      window.removeEventListener('scroll', scrollHandler)
    }
  }

  return (
    <div className="post" ref={postRef}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div>
        <div>{post.created}</div>
        <div>{post.updated}</div>
        <div>{post.hasFetched}</div>
      </div>
    </div>
  )


}
