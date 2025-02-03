import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const [showFooter, setShowFooter] = useState(false);
  const location = useLocation(); 


  useEffect(() => {
    if (location.pathname === '/') {
      const timer = setTimeout(() => {
        setShowFooter(true); 
      }, 3000); 
      
      return () => clearTimeout(timer);
    } else {
      setShowFooter(false); 
    }
  }, [location.pathname]); 

  return (
    <main className="layout-container">
      <Header />
      <div className="content">
        <Outlet />
      </div>
      {showFooter && location.pathname === '/' && <Footer />} 
    </main>
  );
}
