import React, { useState, useEffect, useRef} from "react"
import uniqid from 'uniqid';
import './css/reset.css'
import './css/app.css'

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

        let response = await fetch(`alog-api.brandonburge.com/api/v/1/public/post/${id}`);
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

function PostContainer( props ) {
  const  { posts } = props;
  
  if(!posts || posts.length === 0 ) return <p>Blog Posts Loading</p>

  console.log(posts)

  return (
    <div className="postContainer">
      {posts.map( post => {
        return (
          <Post  id={ post.post_id } key={ uniqid() } />
        )
      })}
    </div>
  )
  
}

function App() {
  const [postList, setPostList] = useState({
    loading: false,
    posts: []
  })
  
  useEffect(() => {

    async function fetchData() {
      

      try {
        let response = await fetch('http://blog-api.brandonburge.com/api/v/1/public/post?limit=post_id');
        let posts = await response.json();
        setPostList({
          loading: false,
          posts: posts
        });

      } catch (err) {
        console.error(err)
      }
    }
    
    fetchData()
    
  }, [setPostList])
  
  return (
    <div className="App">

    <SearchBar />

    <PostContainer posts={postList.posts}/>

    </div>
  );
}

export default App;
