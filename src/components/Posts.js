import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const parse = require('html-react-parser')

export default function Post({ id, cache }) {
  let user = cache.user
  let posts = cache.posts
  let postsObj = JSON.parse(posts)

  const [post, setPost] = useState(() => {
    return {
      title: '',
      name: '',
      content: '',
      updated: new Date(),
      created: new Date(),
    }
  })

  useEffect(() => {
    let data
    const fetchData = async (URL, token) => {
      try {
        let response = await fetch(URL, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        let postData = await response.json()
        let updated = new Date(postData.updatedAt)
        let created = new Date(postData.createdAt)

        setPost(() => {
          return {
            title: postData.title,
            name: postData.name,
            content: postData.content,
            updated: updated,
            created: created,
          }
        })

        return {
          title: postData.title,
          name: postData.name,
          content: postData.content,
          updated: updated,
          created: created,
        }
      } catch (err) {
        console.log(err)
      }
    }

    if (user) {
      let parsedUser = JSON.parse(user)
      data = fetchData(
        `https://blog-api.brandonburge.com/api/v/1/post/${id}`,
        parsedUser.token
      )
    } else {
      data = fetchData(
        `https://blog-api.brandonburge.com/api/v/1/public/post/${id}`,
        ''
      )
    }

    data.then((value) => {
      let obj = {
        [id]: value,
      }
      obj = Object.assign(obj, JSON.parse(posts))
      localStorage.setItem('posts', JSON.stringify(obj))
    })
  }, [id, user, posts])

  if (post.name === '' && postsObj && postsObj[id]) {
    return (
      <Link to={`/post/${id}`} key={id} className='postList'>
        <div className='post'>
          <div className='postHeader'>
            <h2>{postsObj[id].title}</h2>
            <div className='info'>
              <div>By Brandon Burge on {new Date(postsObj[id].created).toDateString()} </div>
              <div>Updated on {new Date(postsObj[id].updated).toDateString()} </div>
            </div>
          </div>
          <div className='content'>
            {parse(postsObj[id].content.substring(0, 150) + '...')}
          </div>
        </div>
      </Link>
    )
  }
  return (
    <Link to={`/post/${id}`} key={id} className='postList'>
      <div className='post'>
        <div className='postHeader'>
          <h2>{post.title}</h2>
          <div className='info'>
            <div>By Brandon Burge on {post.created.toDateString()} </div>
            <div>Updated on {post.updated.toDateString()} </div>
          </div>
        </div>

        <div className='content'>
          {parse(post.content.substring(0, 150) + '...')}
        </div>
      </div>
    </Link>
  )
}
