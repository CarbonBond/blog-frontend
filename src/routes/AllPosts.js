import React, { useState, useRef} from "react"
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
  })
  
  const postRef = useRef(null);

  const isInView = () => {
    const top = postRef.current.getBoundingClientRect().top;
    const windowEdge = window.innerHeight || document.documentElement.clientHeight;
    const offset = windowEdge * 0.5;
    return top <= windowEdge + offset
  }


  let hasFetched = false;
  const fetchData = async () => {
    if(!hasFetched) {
      try {

        let response = await fetch(`http://192.168.0.27:3000/api/v/1/public/post/${id}`);
        let postData = await response.json();
        hasFetched = true;
        setPost({
            title: postData.title,
            content: postData.content,
            updated: Date.parse(postData.updatedAt),
            created: Date.parse(postData.createdAt)
          })
        
      } catch(err) {
        console.log(err)
      }
    }
  }

  window.addEventListener('scroll', () => {
    if(!hasFetched && isInView()) {
      fetchData()
    }
  })

  if(isInView && !hasFetched) {
    fetchData()
  }

  return (
    <div className="post" ref={postRef}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div>
        <div>{post.created}</div>
        <div>{post.updated}</div>
      </div>
    </div>
  )


}

function Posts( props ) {
  const  { posts } = props;
  
  if(!posts || posts.length === 0 ) return <p>Blog Posts Loading</p>

  console.log(posts)

  return (
    <div className="postContainer">
      <SearchBar />

      {posts.map( post => {
        return (
          <Post  id={ post.post_id } key={ uniqid() } />
        )
      })}
    </div>
  )
  
}

export default Posts