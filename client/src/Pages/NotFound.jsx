import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-error mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Page Not Found ❌</h2>
      <p className="text-base-content mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;