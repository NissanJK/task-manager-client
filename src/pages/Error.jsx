import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const Error = ({ message = "Page Not Found", showButton = true }) => {
    const navigate = useNavigate();

    return (
        <div className="error-container">
            <Helmet>
                <title>Task Manager | Error</title>
            </Helmet>
            <div className="error-content">
                <h1 className="error-title">Oops!</h1>
                <p className="error-message">{message}</p>
                {showButton && (
                    <button className="error-button" onClick={() => navigate("/")}>
                        Go Back Home
                    </button>
                )}
            </div>
        </div>
    );
};

export default Error;