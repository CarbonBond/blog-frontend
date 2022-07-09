import { useParams } from 'react-router-dom'
import React, { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import '../../css/post.css'

const parse = require('html-react-parser')

export default function Post() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    updated: null,
    created: null,
    hasFetched: false,
  })

  let user = useOutletContext()
  let parsedUser = JSON.parse(user)
  let params = useParams()
  const navigate = useNavigate()

  const deletePost = async (e) => {
    e.preventDefault()
    try {
      let response = await fetch(
        `https://blog-api.brandonburge.com/api/v/1/post/${params.postid}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${parsedUser.token}`,
          },
        }
      );
      navigate(`/posts`)
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
      let updated = new Date(postData.updatedAt)
      let created = new Date(postData.createdAt)

      setPost((prevPost) => {
        return {
          title: postData.title,
          content: postData.content,
          updated: updated,
          created: created,
          hasFetched: true,
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  if (!post.hasFetched) {
    if (user) {
      let parsedUser = JSON.parse(user)
      fetchData(
        `https://blog-api.brandonburge.com/api/v/1/post/${params.postid}`,
        parsedUser.token
      )
    } else {
      fetchData(
        `https://blog-api.brandonburge.com/api/v/1/public/post/${params.postid}`
      )
    }
    return (
      <section className='postContainer'>
        <div>Loading: Post {params.postid}</div>
      </section>
    )
  }

  if (user) {
    return (
      <div>
        <section className='postContainer'>
          <div>
            <h3>{post.title}</h3>
          </div>

          <div className='dates'>
            <div>Created: {post.created.toDateString()}</div>
            <div>Updated: {post.updated.toDateString()}</div>
            <a href={`${params.postid}/edit`}>edit</a>
            <a href='/' onClick={deletePost}>
              delete
            </a>
          </div>

          <div className='content'>{parse(post.content)}</div>
        </section>
      </div>
    )
  } else {
    return (
      <div>
        <section className='postContainer'>
          <div>
            <h3>{post.title}</h3>
          </div>

          <div className='dates'>
            <div>Created: {post.created.toDateString()}</div>
            <div>Updated: {post.updated.toDateString()}</div>
          </div>

          <div className='content'>{parse(post.content)}</div>
        </section>
      </div>
    )
  }
}
