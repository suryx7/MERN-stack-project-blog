import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    
   
    if (/\s/.test(username)) {
      setError('Username cannot contain spaces');
      return;
    } else {
      setError(''); 
    }

    const response = await fetch('http://localhost:4050/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }), 
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (response.ok) {
      const userInfo = await response.json();
      console.log(userInfo);
      setUserInfo(userInfo); 
      setRedirect(true);
    } else {
      alert('Wrong credentials');
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>} 
      <input 
        type="text" 
        placeholder="Username or Email" 
        value={username} 
        onChange={ev => setUsername(ev.target.value.trim())} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={ev => setPassword(ev.target.value)} 
      />
      <button type="submit">Login</button>
      <p className="link">
        <div className="forgot">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <Link to="/register">Don't have an account?</Link>
      </p>
    </form>
  );
}
