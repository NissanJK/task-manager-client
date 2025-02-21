import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const socket = io("http://localhost:5000"); // Connect to backend WebSocket

const Tasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [error, setError] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [editedStatus, setEditedStatus] = useState("");

    useEffect(() => {
        socket.emit("getTasks", user?.uid);

        socket.on("tasks", (data) => {
            setTasks(data);
        });

        socket.on("taskAdded", (newTask) => {
            setTasks((prev) => [...prev, newTask]);
        });

        socket.on("taskUpdated", (updatedTask) => {
            setTasks((prev) =>
                prev.map((task) =>
                    task._id === updatedTask._id ? updatedTask : task
                )
            );
        });

        socket.on("taskDeleted", (taskId) => {
            setTasks((prev) => prev.filter((task) => task._id !== taskId));
        });

        return () => {
            socket.off("tasks");
            socket.off("taskAdded");
            socket.off("taskUpdated");
            socket.off("taskDeleted");
        };
    }, [user]);

    const handleAddTask = () => {
        if (!taskTitle) {
            setError("Task title is required");
            return;
        }
        socket.emit("addTask", {
            title: taskTitle,
            description: taskDescription,
            status: "To-Do",
            userId: user.uid,
            timestamp: new Date().toISOString(),
        });

        setTaskTitle("");
        setTaskDescription("");
        setError("");
    };

    const handleEditTask = (task) => {
        setEditingTask(task._id);
        setEditedTitle(task.title);
        setEditedDescription(task.description);
        setEditedStatus(task.status);
    };

    const handleSaveEdit = (taskId) => {
        socket.emit("updateTask", {
            _id: taskId,
            title: editedTitle,
            description: editedDescription,
            status: editedStatus,
        });
        setEditingTask(null);
    };

    const handleDeleteTask = (taskId) => {
        socket.emit("deleteTask", taskId);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
    
        const updatedTasks = [...tasks];
        const [movedTask] = updatedTasks.splice(result.source.index, 1);
        movedTask.status = result.destination.droppableId;
    
        updatedTasks.splice(result.destination.index, 0, movedTask);
        setTasks(updatedTasks);
    
        socket.emit("updateTaskStatus", {
            _id: movedTask._id,
            status: movedTask.status,
        });
    };
    
    // Listen for updated tasks from the backend
    useEffect(() => {
        socket.on("tasks", (data) => {
            setTasks(data);
        });
    
        return () => {
            socket.off("tasks");
        };
    }, []);
    
    

    return (
        <div className="p-4 bg-blue-200 text-blue-600">
            <h2 className="text-2xl font-black text-center mb-4">Task Manager</h2>
            {error && <p className="text-red-500">{error}</p>}

            <div className="mb-4 flex flex-col gap-2 w-11/12 md:w-1/2 mx-auto bg-blue-300 p-5 rounded-lg">
                <input
                    type="text"
                    placeholder="Enter Task Title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="border p-2 flex-1 bg-blue-100 rounded-md"
                    maxLength={50}
                />
                <textarea
                    placeholder="Enter Description (Optional)"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="border p-2 flex-1 bg-blue-100 rounded-md"
                    maxLength={200}
                    rows={3}
                ></textarea>
                <button onClick={handleAddTask} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                    Add Task
                </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                {["To-Do", "In Progress", "Done"].map((category) => (
                    <div key={category} className="mb-4 bg-blue-300 text-blue-600 rounded-lg w-11/12 md:w-1/2 mx-auto pt-4">
                        <h3 className="text-xl text-center font-black underline">{category}</h3>
                        <Droppable droppableId={category}>
                            {(provided) => (
                                <ul ref={provided.innerRef} {...provided.droppableProps} className="min-h-[100px] bg-blue-300 p-5 rounded-md">
                                    {tasks
                                        .filter((task) => task.status === category)
                                        .map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <li
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="flex justify-between p-2 my-2 bg-blue-100 shadow rounded-md"
                                                    >
                                                        {editingTask === task._id ? (
                                                            <div className="flex flex-col gap-2 w-full">
                                                                <input
                                                                    type="text"
                                                                    value={editedTitle}
                                                                    onChange={(e) => setEditedTitle(e.target.value)}
                                                                    className="border px-4 py-2 rounded-md w-full"
                                                                    maxLength={50}
                                                                />
                                                                <textarea
                                                                    value={editedDescription}
                                                                    onChange={(e) => setEditedDescription(e.target.value)}
                                                                    className="border px-4 py-2 rounded-md w-full"
                                                                    maxLength={200}
                                                                    rows={3}
                                                                ></textarea>
                                                                <select
                                                                    value={editedStatus}
                                                                    onChange={(e) => setEditedStatus(e.target.value)}
                                                                    className="border px-4 py-2 rounded-md w-full"
                                                                >
                                                                    <option value="To-Do">To-Do</option>
                                                                    <option value="In Progress">In Progress</option>
                                                                    <option value="Done">Done</option>
                                                                </select>
                                                                <button onClick={() => handleSaveEdit(task._id)} className="bg-green-500 text-white px-4 py-2 rounded-md w-full">
                                                                    Save
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col gap-3">
                                                                <div>
                                                                    <p className="font-bold text-xl p-1 rounded-sm w-fit bg-blue-200">{task.title}</p>
                                                                    <p className="text-lg p-1 rounded-sm w-fit bg-blue-200 mt-2">{task.description}</p>
                                                                    <p className="text-md p-1 rounded-sm w-fit bg-blue-200 mt-2">Created: {new Date(task.timestamp).toLocaleString()}</p>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => handleEditTask(task)} className="bg-yellow-500 text-white px-3 py-2 h-fit w-fit text-lg rounded-sm font-bold">
                                                                        Edit
                                                                    </button>
                                                                    <button onClick={() => handleDeleteTask(task._id)} className="bg-red-500 text-white px-3 py-2 h-fit w-fit text-lg rounded-sm font-bold">
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </div>
                ))}
            </DragDropContext>
        </div>
    );
};

export default Tasks;
