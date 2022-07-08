import { useParams } from 'react-router-dom'
import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import '../../css/post.css'
const parse = require('html-react-parser');

export default function Post() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    updated: null,
    created: null,
    hasFetched: false,
  })

  let user = useOutletContext()

  let params = useParams()

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
    return <div>Loading: Post {params.postid}</div>
  } else {
    return (
      <div>
        <section className='postContainer'>
          <h3>{post.title}</h3>
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
