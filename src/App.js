import React, { useState, useEffect } from "react"
import uniqid from 'uniqid';

function SearchBar() {
  return (
    <form> 
      <input type="text" placeholder='Search...' />
    </form>
  )
}

function Post({ title }) {

  return <span> {title} </span>

}

function PostContainer( props ) {
  const  { posts } = props;
  
  if(!posts || posts.length === 0 ) return <p>Blog Posts Loading</p>

  return (
    <div>
      {posts.map( post => {
        return (
          <Post  title={ post.title } key={ uniqid() } />
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
        let response = await fetch('http://192.168.0.27:3000/api/v/1/public/post?limit=title');
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
