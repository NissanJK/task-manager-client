import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, Link } from "react-router-dom";

const Error = () => {
    const location = useLocation();
    const errorCode = location.state?.errorCode || 404;

    const errorMessages = {
        403: "Forbidden: You don’t have permission to access this page.",
        404: "Oops! The page you’re looking for doesn’t exist.",
        500: "Internal Server Error: Something went wrong on our end.",
        502: "Bad Gateway: The server received an invalid response.",
        503: "Service Unavailable: The server is currently unavailable.",
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center">
            <Helmet>
                <title>Task Manager | Error</title>
            </Helmet>
            <h1 className="text-9xl font-bold text-primary animate-bounce">{errorCode}</h1>
            <p className="text-xl text-gray-500 mt-4">{errorMessages[errorCode] || "An unexpected error occurred."}</p>
            <Link to="/" className="btn btn-primary mt-6">Go Home</Link>
        </div>
    );
};

export default Error;
