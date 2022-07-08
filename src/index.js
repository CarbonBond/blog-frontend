import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import Posts from './routes/post/AllPosts.js';
import Post from './routes/post/Post.js';
import CreatePost from './routes/post/CreatePost.jsx';
import NotFound from './components/notFound.js';
import Login from './routes/Login.js';
const container = document.getElementById('root');
const root = createRoot(container);


root.render(
  <BrowserRouter>
    <div>

      <Routes>
        <Route exact path="/" element={<App />} >
          <Route path="login" element={<Login />} />
          <Route path="posts" element={<Posts />} />
          <Route path="post/create" element={<CreatePost />} />
          <Route path="post/:postid" element={<Post />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  </BrowserRouter>
) 
