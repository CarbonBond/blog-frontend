import React, { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'

export default function CreatePost() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    published: false,
    userHook: true,
    token: null,
  })

  const navigate = useNavigate();

  let user = useOutletContext()

  if (user && post.userHook) {
    let parsedUser = JSON.parse(user)
    setPost((oldPost) => {
      return {
        ...post,
        userHook: false,
        token: parsedUser.token
      }
    })
  }

  const postData = async (e) => {
    e.preventDefault();
    try {
      if (!user) throw new Error();
      let body = {
        title: post.title,
        content: post.content,
        published: post.published,
        category: []
      }
      let response = await fetch(
        `https://blog-api.brandonburge.com/api/v/1/post/new`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${post.token}`,
          },
          body: JSON.stringify(body) 
        }
      )
      let postid = await response.json();
      navigate(`/post/${postid}/edit`)
    } catch (err) {
      console.log(err)
    }
  }

  let pub = <div></div>
  if (post.published) {
    pub = <div> True </div>
  } else {
    pub = <div> False </div>
  }


  if (user) {
    return (
      <div>
        <div> {post.title} </div>
        <div> {post.content} </div>
        <div> {pub} </div>
        <form onSubmit={postData}>
          <label>
            Title
            <input
              type='text'
              id='title'
              name='title'
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
          </label>
          <br />
          <label>
            Content
            <textarea
              id='content'
              name='content'
              onChange={(e) => setPost({ ...post, content: e.target.value })}
            />
          </label>
          <br />
          <label>
            published
            <input
              type='checkbox'
              id='published'
              name='published'
              value='true'
              onChange={(e) =>
                setPost((oldpost) => {
                  let isPublished = false
                  if (e.target.checked) {
                    isPublished = true
                  }
                  return { ...post, published: isPublished }
                })
              }
            />
          </label>
          <br />
          <input type='submit' value='submit' />
        </form>
      </div>
    )
  } else {
    return <div>Log in to create at post </div>
  }
}
