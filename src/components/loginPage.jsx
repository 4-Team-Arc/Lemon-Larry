const LoginPage = () => {
  return (
    <>
    <div className='loginForm'>
      <form className='login' onSubmit={(e)=> {e.preventDefault();}}>
        <input placeholder='username'></input>
        <input placeholder='password'></input>
        <button >Login</button>
      </form>
    </div>
    </>
  )
};

export default LoginPage
