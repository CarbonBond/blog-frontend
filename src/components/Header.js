import SearchBar from './Searchbar'
import { Link } from 'react-router-dom'
import '../css/header.css'
export default function Header() {

  return (
    <div className="header">
      <div className='upper'>
        <h1> Brandon's Blog </h1>
        <SearchBar />
      </div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/posts">All Posts</Link>
        <a href="http://brandonburge.com" >BrandonBurge.com</a>
      </nav>

    </div>
  )

}
