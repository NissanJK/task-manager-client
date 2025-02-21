import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-5xl font-bold text-red-500">404</h1>
        <p className="text-lg text-gray-700 mt-2">Oops! Page not found.</p>
        <Link to="/" className="btn btn-primary mt-4">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Error;
