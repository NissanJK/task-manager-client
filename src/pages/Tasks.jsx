import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Swal from "sweetalert2"; // Import SweetAlert
import Loader from "../components/Loader";
import { Helmet } from "react-helmet-async";

const Tasks = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [editedStatus, setEditedStatus] = useState("");

    // Fetch tasks using TanStack Query
    const { data: tasks = [], isLoading, isError } = useQuery({
        queryKey: ["tasks", user?.uid],
        queryFn: async () => {
            const response = await axios.get(
                "https://task-manager-server-pi-weld.vercel.app/api/tasks",
                { params: { userId: user?.uid } }
            );
            return response.data;
        },
        enabled: !!user?.uid, // Only fetch tasks if user is logged in
    });

    // Add task mutation
    const addTaskMutation = useMutation({
        mutationFn: async (newTask) => {
            const response = await axios.post(
                "https://task-manager-server-pi-weld.vercel.app/api/tasks",
                newTask
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks", user?.uid]); // Refetch tasks after adding
            setTaskTitle("");
            setTaskDescription("");
            Swal.fire({
                icon: "success",
                title: "Task Added!",
                text: "Your task has been added successfully.",
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Failed to Add Task",
                text: "Please try again.",
            });
        },
    });

    // Update task mutation
    const updateTaskMutation = useMutation({
        mutationFn: async (updatedTask) => {
            const response = await axios.put(
                `https://task-manager-server-pi-weld.vercel.app/api/tasks/${updatedTask._id}`,
                updatedTask
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks", user?.uid]); // Refetch tasks after updating
            setEditingTask(null);
            Swal.fire({
                icon: "success",
                title: "Task Updated!",
                text: "Your task has been updated successfully.",
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Failed to Update Task",
                text: "Please try again.",
            });
        },
    });

    // Delete task mutation
    const deleteTaskMutation = useMutation({
        mutationFn: async (taskId) => {
            await axios.delete(
                `https://task-manager-server-pi-weld.vercel.app/api/tasks/${taskId}`
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks", user?.uid]); // Refetch tasks after deleting
            Swal.fire({
                icon: "success",
                title: "Task Deleted!",
                text: "Your task has been deleted successfully.",
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Failed to Delete Task",
                text: "Please try again.",
            });
        },
    });

    // Handle adding a task
    const handleAddTask = () => {
        if (!taskTitle) {
            Swal.fire({
                icon: "warning",
                title: "Task Title Required",
                text: "Please enter a title for the task.",
            });
            return;
        }
        addTaskMutation.mutate({
            title: taskTitle,
            description: taskDescription,
            status: "To-Do",
            userId: user.uid,
            timestamp: new Date().toISOString(),
        });
    };

    // Handle editing a task
    const handleEditTask = (task) => {
        setEditingTask(task._id);
        setEditedTitle(task.title);
        setEditedDescription(task.description);
        setEditedStatus(task.status);
    };

    // Handle saving an edited task
    const handleSaveEdit = (taskId) => {
        updateTaskMutation.mutate({
            _id: taskId,
            title: editedTitle,
            description: editedDescription,
            status: editedStatus,
        });
    };

    // Handle deleting a task
    const handleDeleteTask = (taskId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTaskMutation.mutate(taskId);
            }
        });
    };

    // Handle drag-and-drop
    const handleDragEnd = async (result) => {
        if (!result.destination) return;
    
        const updatedTasks = [...tasks];
        const [movedTask] = updatedTasks.splice(result.source.index, 1);
        movedTask.status = result.destination.droppableId;
    
    
        // Update the backend first
        try {
            await axios.patch(`https://task-manager-server-pi-weld.vercel.app/api/tasks/${movedTask._id}/status`, {
                status: movedTask.status,
                order: result.destination.index,
            });
    
            // Update the local state after the backend confirms the update
            updatedTasks.splice(result.destination.index, 0, movedTask);
            queryClient.setQueryData(["tasks", user?.uid], updatedTasks);
    
            // Show success message
            Swal.fire({
                icon: "success",
                title: "Task Moved!",
                text: "Your task has been moved successfully.",
            });
        } catch (error) {
    
            // Show error message
            Swal.fire({
                icon: "error",
                title: "Failed to Move Task",
                text: "Please try again.",
            });
    
            // Revert the local state if the backend update fails
            queryClient.setQueryData(["tasks", user?.uid], tasks);
        }
    };
    if (isLoading) return <div className="h-screen flex justify-center items-center"><Loader/></div>;
    if (isError) return <div>Failed to fetch tasks. Please try again.</div>;

    return (
        <div className="p-4 bg-blue-200 text-blue-600">
            <Helmet>
                <title>Task Manager | Tasks</title>
            </Helmet>
            <h2 className="text-2xl font-black text-center mb-4">Task Manager</h2>

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