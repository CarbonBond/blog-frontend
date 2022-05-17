import React from "react"
import { Outlet } from 'react-router-dom';
import './css/reset.css'
import './css/app.css'
import Header from './components/Header.js';

function App() {


  return (

    <div className="App">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
