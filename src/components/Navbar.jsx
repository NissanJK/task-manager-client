import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Function to check if the current link is active
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-xl font-black">
                    Task Manager
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-4 font-black">
                    {user ? (
                        <>
                            <Link
                                to="/"
                                className={`px-4 py-2 rounded-md ${
                                    isActive("/") ? "bg-white text-blue-600" : "hover:underline"
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/dashboard"
                                className={`px-4 py-2 rounded-md ${
                                    isActive("/dashboard") ? "bg-white text-blue-600" : "hover:underline"
                                }`}
                            >
                                Profile
                            </Link>
                            <Link
                                to="/tasks"
                                className={`px-4 py-2 rounded-md ${
                                    isActive("/tasks") ? "bg-white text-blue-600" : "hover:underline"
                                }`}
                            >
                                Tasks
                            </Link>
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white text-2xl"
                    onClick={() => setIsDrawerOpen(true)}
                >
                    <FiMenu />
                </button>
            </div>

            {/* Mobile Drawer with Smooth Animation */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        {/* Background Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDrawerOpen(false)}
                        />

                        {/* Drawer Menu */}
                        <motion.div
                            className="fixed top-0 left-0 w-3/4 max-w-sm h-full bg-blue-200 shadow-lg p-5 flex flex-col z-50"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        >
                            {/* Close Button */}
                            <button
                                className="text-white text-2xl self-end"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                <FiX />
                            </button>

                            {/* Navigation Links */}
                            <nav className="mt-10 space-y-4 font-bold">
                                <Link
                                    to="/"
                                    className={`block px-4 py-2 rounded-md ${
                                        isActive("/") ? "bg-white text-blue-700" : "hover:bg-blue-600"
                                    }`}
                                    onClick={() => setIsDrawerOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className={`block px-4 py-2 rounded-md ${
                                        isActive("/dashboard") ? "bg-white text-blue-700" : "hover:bg-blue-600"
                                    }`}
                                    onClick={() => setIsDrawerOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/tasks"
                                    className={`block px-4 py-2 rounded-md ${
                                        isActive("/tasks") ? "bg-white text-blue-700" : "hover:bg-blue-600"
                                    }`}
                                    onClick={() => setIsDrawerOpen(false)}
                                >
                                    Tasks
                                </Link>
                                {user ? (
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsDrawerOpen(false);
                                        }}
                                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md w-full"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md block text-center"
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        Login
                                    </Link>
                                )}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
