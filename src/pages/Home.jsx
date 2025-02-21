import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Home = () => {
    const { user, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-blue-200 text-blue-600">
            <Helmet>
                <title>Task Manager | Home</title>
            </Helmet>
            <h1 className="text-2xl md:text-3xl font-black text-center mt-10">Welcome to <br /> Task Management App</h1>
            <img
                src={"https://media.istockphoto.com/id/1303877287/vector/paper-checklist-and-pencil-flat-pictogram.jpg?s=612x612&w=0&k=20&c=NoqPzn94VH2Pm7epxF8P5rCcScMEAiGQ8Hv_b2ZwRjY="}
                alt="User"
                className="size-60 mt-4 rounded-full mx-auto mb-4 border-4 border-gray-300"
            />
            {user ? (
                <button className="bg-blue-600 text-white px-4 py-2 mt-4 mb-10 rounded" onClick={() => navigate("/tasks")}>
                    Go to Task Manager
                </button>
            ) : (
                <button className="bg-green-600 text-white px-4 py-2 mt-4 mb-10 rounded" onClick={loginWithGoogle}>
                    Login with Google
                </button>
            )}
        </div>
    );
};

export default Home;
