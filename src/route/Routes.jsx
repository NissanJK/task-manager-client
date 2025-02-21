import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Tasks from "../pages/Tasks";
import App from "../App";
import Error from "../pages/Error";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <Error />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: '/dashboard',
                element: <PrivateRoute><Dashboard /></PrivateRoute>,
            },
            {
                path: '/tasks',
                element: <PrivateRoute><Tasks /></PrivateRoute>,
            },
        ],
    },
]);

const Routes = () => {
    return <RouterProvider router={router} />;
};

export default Routes;
