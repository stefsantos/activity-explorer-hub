
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-5xl font-bold mb-4 text-red-500">404</h1>
        <p className="text-xl text-gray-700 mb-4">Oops! Page not found</p>
        <p className="text-gray-600 mb-6">
          The page <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> could not be found.
        </p>
        <div className="flex flex-col space-y-3">
          <Link to="/" className="text-blue-500 hover:text-blue-700 underline font-medium">
            Return to Home
          </Link>
          <Link to="/activities" className="text-blue-500 hover:text-blue-700 underline">
            Browse Activities
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
