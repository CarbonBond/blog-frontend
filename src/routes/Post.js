import Header from '../components/Header.js';
import { useParams } from "react-router-dom";
import React, { useState } from "react"

export default function Post() {

  const [post, setPost] = useState({
    title: '',
    content: '',
    updated: null,
    created: null,
    hasFetched: false,
  })


  let params = useParams();

  const fetchData = async () => {
    try {
      let response = await fetch(`http://blog-api.brandonburge.com/api/v/1/public/post/${params.postid}`);
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
    fetchData()
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
