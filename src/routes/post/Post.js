import { useParams } from 'react-router-dom'
import React, { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import '../../css/post.css'

const parse = require('html-react-parser')

export default function Post() {
  
  const cache = useOutletContext();
  const user = cache.user;
  const posts = cache.posts;
  let params = useParams()

  const [post, setPost] = useState({
    title: '',
    content: '',
    updated: null,
    created: null,
    hasFetched: false,
    ...posts[params.postid]
  })

  let parsedUser = JSON.parse(user)
  const navigate = useNavigate()

  if (posts && posts[params.postid] && !post.hasFetched) {
    let updated = new Date(post[params.postid].updatedAt);
    let created = new Date(post[params.postid].createdAt);
    setPost(() => {
      return {
        title: posts[params.postid].title,
        name: posts[params.postid].name,
        content: posts[params.postid].content,
        updated: updated,
        created: created,
        hasFetched: true
      }
    })
    return;
  }

  const deletePost = async (e) => {
    e.preventDefault()
    try {
      await fetch(
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

      setPost(() => {
        return {
          title: postData.title,
          content: postData.content,
          updated: updated,
          created: created,
          hasFetched: true,
        }
      })

      localStorage.setItem('posts', {
        [params.postid]: {
          title: postData.title,
          name: postData.name,
          content: postData.content,
          updated: updated,
          created: created,
          hasFetched: true
        },
        ...posts
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
