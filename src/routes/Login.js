import Header from '../components/Header.js'
import React, { useState } from "react";

export default function Login() {

  const [nameValue, setNameValue] = useState('');
  const [passValue, setPassValue] = useState('');

  let handleSubmit = (event) => {
    event.preventDefault();

    const fetchData = async () => {
      try {
        let response = await fetch('http://blog-api.brandonburge.com/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: nameValue,
            password: passValue
          })
        })
        let data = await response.json();
        if (response.status !== 200) {
          alert(data.info.message)
        }
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData();

  }

  let handleNameChange = (event) => {
    setNameValue(event.target.value)
  }
  let handlePassChange = (event) => {
    setPassValue(event.target.value)
  }

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={nameValue} onChange={handleNameChange} />
        </label>
        <label>
          Password:
          <input type="password" value={passValue} onChange={handlePassChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}


