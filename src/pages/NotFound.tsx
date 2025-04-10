
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-cng-light flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-cng-primary">404</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn-primary flex items-center justify-center mx-auto"
        >
          <Home size={18} className="mr-2" />
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
