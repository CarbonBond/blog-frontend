import React, { useState } from "react";
import { useOutletContext, Navigate } from 'react-router-dom'

export default function Login() {

  const [nameValue, setNameValue] = useState('');
  const [passValue, setPassValue] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  const cache = useOutletContext();

  let handleSubmit = (event) => {
    event.preventDefault();

    const fetchData = async () => {
      try {
        if(hasFetched) return;
        let response = await fetch('https://blog-api.brandonburge.com/auth/login', {
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
          return;
        }

        const user = {
          token: data.token,
          name: data.user.name,
          id: data.user.user_id,
          email: data.user.email
        }
        setHasFetched(true);
        localStorage.setItem('user', JSON.stringify(user))
        window.location.reload(false);
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

  if (cache && cache.user) {
    return (<Navigate to="/" replace="true" />)
  }
  return (
    <div>
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


