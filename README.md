# Task Manager Client  

A **React-based** frontend for the Task Manager application, built with **Vite**, **TailwindCSS**, and **Firebase** for authentication.  

## Table of Contents  

- [Introduction](#introduction)  
- [Features](#features)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Configuration](#configuration)  
- [Dependencies](#dependencies)  
- [Troubleshooting](#troubleshooting)  
- [License](#license)  

## Introduction  

The **Task Manager Client** is a web-based interface for managing tasks, providing authentication via Firebase and smooth UI interactions with **Framer Motion** and **Drag-and-Drop** support.  

## Features  

- **User Authentication** using Firebase.  
- **Task Management** with Drag-and-Drop functionality.  
- **State Management** with React Query.  
- **Styled Components** for UI customization.  
- **Responsive UI** with TailwindCSS and DaisyUI.  

## Installation  

### Prerequisites  

Ensure you have the following installed:  

- [Node.js](https://nodejs.org/)  
- [Vite](https://vitejs.dev/) (installed via dependencies)  

### Steps  

1. **Clone the repository**  
   ```sh
   git clone https://github.com/your-username/task-manager-client.git
   cd task-manager-client
   ```

2. **Install dependencies**  
   ```sh
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file in the project root and add the following:  
   ```env
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-firebase-app-id
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Run the development server**  
   ```sh
   npm run dev
   ```

5. **Build for production**  
   ```sh
   npm run build
   ```

## Usage  

- Visit `http://localhost:5173/` (or the assigned port) in your browser.  
- Sign in using Firebase authentication.  
- Add, update, delete, and reorder tasks with drag-and-drop.  

## Configuration  

This project uses environment variables for API and Firebase settings. Ensure your `.env` file is correctly configured.  

## Dependencies  

The project relies on the following packages:

### Main Dependencies  

| Package                     | Version  | Description |
|-----------------------------|---------|-------------|
| react                       | ^19.0.0 | React framework |
| react-dom                   | ^19.0.0 | React DOM bindings |
| react-router-dom            | ^7.2.0  | Routing for React |
| firebase                    | ^11.3.1 | Firebase authentication |
| axios                       | ^1.7.9  | HTTP client |
| tailwindcss                 | ^4.0.7  | Utility-first CSS framework |
| styled-components           | ^6.1.15 | Styled components for styling |
| sweetalert2                 | ^11.17.2 | Popup notifications |
| framer-motion               | ^12.4.7 | Animation library |
| @hello-pangea/dnd           | ^18.0.1 | Drag-and-drop functionality |
| @tanstack/react-query       | ^5.66.9 | React Query for data fetching |

### Development Dependencies  

| Package                     | Version  | Description |
|-----------------------------|---------|-------------|
| vite                        | ^6.1.0  | Vite build tool |
| @vitejs/plugin-react        | ^4.3.4  | React plugin for Vite |
| eslint                      | ^9.19.0 | Linter for JavaScript |
| daisyui                     | ^5.0.0-beta.8 | Tailwind component library |

## Troubleshooting  

- **Firebase authentication issues**: Ensure Firebase credentials in `.env` are correct.  
- **Backend connection issues**: Verify `VITE_API_BASE_URL` is correctly set to the server URL.  
- **Styling issues**: Ensure TailwindCSS and DaisyUI are installed properly.  
