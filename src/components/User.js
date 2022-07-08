

export default function User() {

  let logout = () => {
    localStorage.removeItem('user');
    window.location.reload(false);
  }


  return (
    <div>
      <button><a href="/post/create">Create</a></button>
      <button onClick={logout}> Logout </button>
    </div>
  )

}
