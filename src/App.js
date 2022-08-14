import React, { useState } from "react"
import { Outlet } from 'react-router-dom';
import './css/reset.css'
import './css/app.css'
import Header from './components/Header.js'

function App() {
  const [cache, setCache] = useState({user: localStorage.getItem('user'), posts: localStorage.getItem('posts')})

  const mapDispatchToProps = async () => {
    let foundUser = localStorage.getItem('user')
    if (!foundUser || foundUser === '') {
      return;
    }

    let foundPosts = localStorage.getItem('posts')
    if (!foundPosts || foundPosts === '') {
      return;
    }
    if(typeof foundUser === {} && typeof foundUser === {}) {
      let user = JSON.parse(foundUser);
      let posts = JSON.parse(foundPosts);

    setCache({user: user,  posts: posts} )  
    }
  }

  mapDispatchToProps()
  return (

    <div className="App">
      <Header user={cache.user} />
      <Outlet context={cache} />
    </div>
  );
}

export default App;
