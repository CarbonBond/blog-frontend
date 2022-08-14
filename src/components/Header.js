import SearchBar from './Searchbar'
import { Link } from 'react-router-dom'
import '../css/header.css'
import User from './User.js'

export default function Header(props) {

  return (
    <div className="header">
      <div className='upper'>
        <h1> Brandon's Blog </h1>
        {/* <SearchBar /> */}
        {props.user ? (
          <User />
        ) : (
          <button><Link to="/login"> Login </Link></button>
        )}
      </div>
      <nav className="nav">
        <Link to="/posts">All Posts</Link>
        <a href="https://brandonburge.com" >BrandonBurge.com</a>
      </nav>

    </div>
  )

}
