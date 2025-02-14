import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import search_icon from "../assets/search-w.png";
import logo from '../assets/favicon.ico';
import BACKEND_URL from "../config";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/profile`, {
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest(".nav-links") && !event.target.closest(".menu-button")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchOpen && !event.target.closest(".search-box")) {
        setSearchOpen(false);
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [searchOpen]);

  function logout() {
    fetch(`${BACKEND_URL}/logout`, {
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
      <div className="navbar-left">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <div className="logoContainer">
          <img className="logoImage" src={logo} alt="Logo" />
            <Link to="/" className={`logo ${isSearchOpen ? "hide-mobile" : ""}`}>
            AnalyzedByIITIANS
            </Link>
        </div>
      </div>

      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <ul>
          {/* <li className="logo menu-logo">AnalyzedByIITIANS</li> */}
          {/* <hr class="line" /> */}
          {username && role === "ADMIN" && (
            <li><Link to="/create" onClick={() => setMenuOpen(false)}>Add New Course</Link></li>
          )}
          {username ? (
            <li><Link onClick={logout}>Logout ({username})</Link></li>
          ) : (
            <>
              <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
              <li><Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link></li>
            </>
          )}
        </ul>
      </nav>

      <div className="search-box">
        {searchOpen && (
          <input
            className="search-bar"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}  
            autoFocus
          />
        )}
        {!searchQuery &&
          <p className="search-button" onClick={() => setSearchOpen(true)}>
            <img src={search_icon} alt="Search Icon" className="search-icon" />
          </p>
        }
        {searchOpen && searchQuery && (
          <Link  
            to={`/search?query=${searchQuery}`} className="search-icon">
            <img src={search_icon} alt="Search Icon" />
          </Link>
        )}
      </div>
    </header>
  );
}
