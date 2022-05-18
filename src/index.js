import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import Posts from './routes/AllPosts.js';
import Post from './routes/Post.js';
import NotFound from './components/notFound.js';
import Login from './routes/Login.js';

const container = document.getElementById('root');
const root = createRoot(container);


root.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="posts" element={<Posts />} />
      <Route path="post/:postid" element={<Post />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
) 
