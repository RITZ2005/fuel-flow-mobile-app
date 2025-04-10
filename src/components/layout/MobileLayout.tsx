
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, CalendarClock, User } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  hideNavBar?: boolean;
}

const MobileLayout = ({ children, title, hideNavBar = false }: MobileLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="mobile-screen">
      {title && (
        <div className="mobile-header">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
      )}
      
      <div className="mobile-content">
        {children}
      </div>
      
      {!hideNavBar && (
        <div className="mobile-footer">
          <nav className="nav-tabs">
            <button 
              className={`nav-tab ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              <Home size={20} />
              <span>Home</span>
            </button>
            <button 
              className={`nav-tab ${isActive('/stations') ? 'active' : ''}`}
              onClick={() => navigate('/stations')}
            >
              <MapPin size={20} />
              <span>Stations</span>
            </button>
            <button 
              className={`nav-tab ${isActive('/bookings') ? 'active' : ''}`}
              onClick={() => navigate('/bookings')}
            >
              <CalendarClock size={20} />
              <span>Bookings</span>
            </button>
            <button 
              className={`nav-tab ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => navigate('/profile')}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileLayout;
