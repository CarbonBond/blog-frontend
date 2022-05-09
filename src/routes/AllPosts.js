import React, { useState, useRef, useEffect} from "react"
import uniqid from 'uniqid';

function SearchBar() {
  return (
    <form className="searchBar"> 
      <input type="text" placeholder='Search...' />
    </form>
  )
}

function Post({ id }) {

  const [post, setPost] = useState({
    title: '',
    content: '',
    updated: null,
    created: null,
    hasFetched: false,
  })

  const postRef = useRef(null);

  const isInView = () => {
    const top = postRef.current.getBoundingClientRect().top;
    const windowEdge = window.innerHeight || document.documentElement.clientHeight;
    const offset = windowEdge * 0.5;
    return top <= windowEdge + offset
  }

  const fetchData = async () => {
    try {
      console.log('fetching...')
      let response = await fetch(`http://blog-api.brandonburge.com/api/v/1/public/post/${id}`);
      let postData = await response.json();
        setPost( prevPost => {
          return {
            title: postData.title,
            content: postData.content,
            updated: Date.parse(postData.updatedAt),
            created: Date.parse(postData.createdAt),
            hasFetched: true
          }
        })
      
    } catch(err) {
      console.log(err)
    }
  }

  if(isInView && !post.hasFetched ) {
    scrollHandler()
  }
  window.addEventListener('scroll', scrollHandler)


  function scrollHandler() {
    if(isInView && !post.hasFetched ) {
      fetchData()
      window.removeEventListener('scroll', scrollHandler)
    }
  }

  return (
    <div className="post" ref={postRef}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div>
        <div>{post.created}</div>
        <div>{post.updated}</div>
        <div>{post.hasFetched}</div>
      </div>
    </div>
  )


}

function Posts( props ) {

  const [postList, setPostList] = useState({
    loading: true,
    posts: []
  })
  

  async function fetchData() {
    

    try {
      let response = await fetch('http://blog-api.brandonburge.com//api/v/1/public/post?limit=post_id');
      let posts = await response.json();
      setPostList({
        loading: false,
        posts: posts
      });

    } catch (err) {
      console.error(err)
    }
  }
  
  if(postList.loading) {
    fetchData()
  }
    
  
  if(!postList.posts|| postList.posts.length === 0 ) return <p>Blog Posts Loading</p>

  console.log(postList.posts)

  return (
    <div className="postContainer">
      <SearchBar />

      {postList.posts.map( post => {
        return (
          <Post  id={ post.post_id } key={ uniqid() } />
        )
      })}
    </div>
  )
  
}

export default Posts