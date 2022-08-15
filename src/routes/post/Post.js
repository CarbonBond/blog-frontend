import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import '../../css/post.css'

const parse = require('html-react-parser')

export default function Post() {
  const cache = useOutletContext()
  const user = cache.user
  const posts = cache.posts
  let params = useParams()
  let postsObj = JSON.parse(posts)

  const [post, setPost] = useState({
    title: '',
    name: '',
    content: '',
    updated: null,
    created: null,
  })

  useEffect(() => {
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
    let data

    if (user) {
      let parsedUser = JSON.parse(user)
      data = fetchData(
        `https://blog-api.brandonburge.com/api/v/1/post/${params.postid}`,
        parsedUser.token
      )
    } else {
      data = fetchData(
        `https://blog-api.brandonburge.com/api/v/1/public/post/${params.postid}`
      )
    }

    data.then((value) => {
      let obj = {
        [params.postid]: value,
      }
      obj = Object.assign(obj, JSON.parse(posts))
      localStorage.setItem('posts', JSON.stringify(obj))
    })
  }, [posts, user, params.postid])
  let parsedUser = JSON.parse(user)
  const navigate = useNavigate()

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
      )
      navigate(`/posts`)
    } catch (err) {
      console.log(err)
    }
  }

  if (!post.updated && postsObj && postsObj[params.postid]) {
    return (
      <div>
        <section className='postContainer'>
          <div>
            <h3>{postsObj[params.postid].title}</h3>
          </div>

          <div className='dates'>
            <div>Created: {new Date(postsObj[params.postid].created).toDateString()}</div>
            <div>Updated: {new Date(postsObj[params.postid].updated).toDateString()}</div>
          </div>

          <div className='content'>{parse(postsObj[params.postid].content)}</div>
        </section>
      </div>
    )
  }

  if (!post.updated) {
    return (
      <div>
        <section className='postContainer'>Posts Loading...</section>
      </div>
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
