import React, { useState, useEffect} from "react"
import { Link } from 'react-router-dom'
import './css/reset.css'
import './css/app.css'

function App() {
  const [postList, setPostList] = useState({
    loading: false,
    posts: []
  })
  
  useEffect(() => {

    async function fetchData() {
      

      try {
        let response = await fetch('http://192.168.0.27:3000/api/v/1/public/post?limit=post_id');
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

      <Link to="/posts">Posts</Link>

    </div>
  );
}

export default App;
