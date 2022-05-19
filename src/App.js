import React, { useState } from "react"
import { Outlet } from 'react-router-dom';
import './css/reset.css'
import './css/app.css'
import Header from './components/Header.js'

function App() {
  const [user, setUser] = useState(localStorage.getItem('user'))

  const mapDispatchToProps = async () => {
    let foundUser = localStorage.getItem('user')
    if (!foundUser || foundUser === '') {
      return;
    }

    if (typeof user === {}) {
      setUser(JSON.parse(foundUser))
    }
  }

  mapDispatchToProps()
  return (

    <div className="App">
      <Header user={user} />
      <Outlet context={user} />
    </div>
  );
}

export default App;
