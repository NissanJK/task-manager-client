import React, { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const googleProvider = new GoogleAuthProvider();

    // Google Sign-in with SweetAlert
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { uid, email, displayName } = result.user;

            await fetch("https://task-manager-server-pi-weld.vercel.app/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid, email, displayName }),
            });

            Swal.fire({
                icon: "success",
                title: "Login Successful!",
                text: `Welcome, ${displayName}!`,
                timer: 2000,
                showConfirmButton: false,
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: error.message,
            });
        }
    };

    // Logout with SweetAlert
    const logout = async () => {
        try {
            await signOut(auth);
            Swal.fire({
                icon: "success",
                title: "Logged Out",
                text: "You have successfully logged out.",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Logout Failed",
                text: error.message,
            });
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="h-screen flex justify-center items-center"><Loader/></div>;
    }

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
