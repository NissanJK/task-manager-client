import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Login = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        await loginWithGoogle();
        navigate("/dashboard");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-blue-200 text-blue-600">
            <Helmet>
                <title>Task Manager | Login</title>
            </Helmet>
            <h1 className="text-4xl font-black mb-6">Login to Task Manager</h1>
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleLogin}>
                Sign in with Google
            </button>
        </div>
    );
};

export default Login;
