import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { StrictMode } from "react";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import Routes from "./route/Routes";

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <HelmetProvider>
            <AuthProvider>
                <Routes />
            </AuthProvider>
        </HelmetProvider>
    </StrictMode>
);
