import { useParams } from 'react-router-dom'
import EditArea from '../../components/EditArea'
import React, { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'

export default function CreatePost() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    published: false,
    userHook: true,
    hasFetched: false,
    token: null,
  })

  let user = useOutletContext()

  let params = useParams()
  const navigate = useNavigate()

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
        updated: new Date(),
        category: [],
      }
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
    } catch (err) {
      console.log(err)
    }
  }

  if (!post.hasFetched && user) {
    let parsedUser = JSON.parse(user)
    fetchData(
      `https://blog-api.brandonburge.com/api/v/1/post/${params.postid}/md`,
      parsedUser.token
    )
  }

  return <EditArea />
}
