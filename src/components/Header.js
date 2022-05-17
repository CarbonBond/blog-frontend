import SearchBar from './Searchbar'
import { Link } from 'react-router-dom'
import '../css/header.css'
export default function Header() {

  return (
    <div className="header">
      <h1> BB Blog </h1>
      <SearchBar />
      <nav className="nav">
        <Link to="/posts">Posts</Link>
      </nav>

    </div>
  )

}
