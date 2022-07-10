import { useParams } from 'react-router-dom'
import React, { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import '../css/postEdit.css'

export default function EditArea() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    published: false,
    userHook: true,
    token: null,
    updated: null,
  })

  const navigate = useNavigate()

  let user = useOutletContext()

  let params = useParams()

  if (user && post.userHook) {
    let parsedUser = JSON.parse(user)
    setPost((oldPost) => {
      return {
        ...post,
        userHook: false,
        token: parsedUser.token,
      }
    })
  }

  const postData = async (e) => {
    e.preventDefault()
    try {
      if (!user) throw new Error()
      let body = {
        title: post.title,
        content: post.content,
        published: post.published,
        category: [],
        updated: new Date(),
      }

      if (params.postid) {
        let response = await fetch(
          `https://blog-api.brandonburge.com/api/v/1/post/${params.postid}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${post.token}`,
            },
            body: JSON.stringify(body),
          }
        )

        navigate(`/post/${params.postid}`)
      } else {
        let response = await fetch(
          `https://blog-api.brandonburge.com/api/v/1/post/new`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${post.token}`,
            },
            body: JSON.stringify(body),
          }
        )
        let postid = await response.json()
        navigate(`/post/${postid}`)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchData = async (url, token) => {
    try {
      let response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      let postData = await response.json()

      setPost((prevPost) => {
        return {
          ...post,
          title: postData.title,
          content: postData.content,
          updated: postData.updated,
          hasFetched: true,
        }
      })
      console.log('Filling post')
    } catch (err) {
      console.log(err)
    }
  }

  if (!post.hasFetched && user ) {
    if (params.postid) {

      let parsedUser = JSON.parse(user)
      fetchData(
        `https://blog-api.brandonburge.com/api/v/1/post/${params.postid}/md`,
        parsedUser.token
      )
    } else {
      setPost({...post, hasFetched:true,})
    }
  }

  let pub = <div></div>
  if (post.published) {
    pub = <div> True </div>
  } else {
    pub = <div> False </div>
  }

  if (post.hasFetched && user) {
    return (
      <div className='formContainer'>
        <form onSubmit={postData}>
          <label className='text'>
            Title
            <input
              type='text'
              id='title'
              name='title'
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              value={post.title}
            />
          </label>
          <br />
          <label className='text'>
            Content
            <textarea
              id='content'
              name='content'
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              value={post.content}
            />
          </label>
          <br />
          <label className='checkbox'>
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
  }

  return <div className='formContainer'> Loading </div>
}
