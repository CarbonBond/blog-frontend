import { useParams } from "react-router-dom";
import React, { useState } from "react"
import { useOutletContext } from 'react-router-dom'

export default function Post() {

  const [post, setPost] = useState({
    title: '',
    content: '',
    updated: null,
    created: null,
    hasFetched: false,
  })

  let user = useOutletContext();

  let params = useParams();

  const fetchData = async (url, token) => {
    try {
      let response = await fetch(
        url,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
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

  if (!post.hasFetched) {
    if (user) {
      let parsedUser = JSON.parse(user);
      fetchData(`http://blog-api.brandonburge.com/api/v/1/post/${params.postid}`, parsedUser.token)
    } else {
      fetchData(`http://blog-api.brandonburge.com/api/v/1/public/post/${params.postid}`)
    }
    return <div>
      Loading: Post {params.postid}
    </div>
  } else {
    return (
      <div>
        <section>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <div>
            <div>{post.created}</div>
            <div>{post.updated}</div>
          </div>
        </section>

      </div>
    )
  }

}
