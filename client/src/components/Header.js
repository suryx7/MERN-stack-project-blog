import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import search_icon from "../assets/search-b.png";
import logo from '../assets/favicon.ico';

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:4050/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((userInfo) => {
            setUserInfo(userInfo);
          });
        } else {
          setUserInfo(null); 
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user info:", error);
        setUserInfo(null); 
      });
  }, [setUserInfo]);

  function logout() {
   
    fetch("http://localhost:4050/logout", {
      credentials: "include",
      method: "POST",
    }).then(() => {
      setUserInfo(null); 
    });
  }

  const username = userInfo?.username;
  const role = userInfo?.role;

  return (
    <header className="navbar">
      <div className="logoContainer">
        <img className="logoImage" src={logo} alt="Logo" />
        <Link to="/" className="logo">
          AnalyzedByIITIANS
        </Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {username && (
            <>
              {role === "ADMIN" && (
                <li><Link to="/create">Add new course</Link></li>
              )}
              <li><Link onClick={logout}>Logout ({username})</Link></li>
              {/* <li><Link to='/profile'>Profile</Link></li> */}
            </>
          )}

          {!username && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>


      <div className="search-box">
        <input
          className="search-bar"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery ? (
          <Link to={`/search?query=${searchQuery}`}>
            <img src={search_icon} alt="Search Icon" className="search-icon" />
          </Link>
        ) : null} 
      </div>
    </header>
  );
}
