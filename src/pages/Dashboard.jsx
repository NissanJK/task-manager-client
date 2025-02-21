import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-200 text-blue-600 p-4">
            <h1 className="text-2xl md:text-3xl font-black mb-4">Welcome to User Profile</h1>
            {user && (
                <div className="bg-blue-100 shadow-md rounded-lg p-6 text-center md:w-1/2 h-4/5">
                    <img
                        src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/4042/4042171.png"}
                        alt="User"
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-300"
                    />
                    <p className="text-2xl font-bold">Hello, {user.displayName}</p>
                    <p className="text-xl text-bold">{user.email}</p>
                    <button
                        onClick={handleLogout}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
