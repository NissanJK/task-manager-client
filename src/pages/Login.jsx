import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        await loginWithGoogle();
        navigate("/dashboard");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-6">Login to Task Manager</h1>
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleLogin}>
                Sign in with Google
            </button>
        </div>
    );
};

export default Login;
