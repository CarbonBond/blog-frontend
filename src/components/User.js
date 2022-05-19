

export default function User() {

  let logout = () => {
    localStorage.removeItem('user');
    window.location.reload(false);
  }


  return (
    <div>
      <button onClick={logout}> Logout </button>
    </div>
  )

}
