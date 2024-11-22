"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { signOut, useSession } from "next-auth/react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type UniqueIdentifier,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  TouchSensor,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import SortableContainer from "./SortableContainer";
import { FaRegSave, FaPlus, FaCheckCircle   } from "react-icons/fa";
import SortableItem from "./SortableItem";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import Link from "next/link";

interface TaskItem {
  id: string;
  name: string;
  date: string;
  note: string;
}

interface Items {
  [key: string]: TaskItem[];
}

const Container = () => {
 
  const [items, setItems] = useState<Items>({
    container1: [],
    container2: [],
    container3: [],
    container4: [],
  });

  const [activeId, setActiveId] = useState<UniqueIdentifier>();
  const { data: session, status } = useSession();
  // Find the active item based on the activeId
  const activeItem = activeId
    ? Object.values(items)
        .flat()
        .find((item) => item.id === activeId)
    : null;

  const [newTask, setNewTask] = useState("");
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false); 
  const { toast } = useToast();
  const loadTasks = async () => {
    if (!session) {
      toast({
        title: "Couldn't load tasks.",
        description: "Please sign in to load your tasks.",
        action: <ToastAction className='border-0' altText="Try again">
        <Button variant="default">
          <Link href='/signin'>Sign In</Link>
        </Button>
      </ToastAction>,
      })
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`/api/task?id=${session.user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
  
      const fetchedData = await response.json();
  
      // Check if fetchedData contains a `tasks` property
      const fetchedTasks = Array.isArray(fetchedData) ? fetchedData : fetchedData.tasks;
      
      if (!Array.isArray(fetchedTasks)) {
        throw new Error("Invalid task data format");
      }
      
      for (const task of fetchedTasks) {
        const newItem = {
          id: task._id,
          name: task.name,
          date: task.date,
          note: task.note, // You can modify this as needed
        };
        setItems((prevItems) => ({
          ...prevItems,                  // Spread previous state
          [task.container]: [...prevItems[task.container], newItem],  // Add the new item to the appropriate container
        }));
      }
  
      
    } catch (error) {
      toast({
        title: "Failed to load tasks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Function to add a new task
  const addTask = (event) => {
    event.preventDefault();  // Prevent page reload
    if (!newTask || !newNote) return;  // Check if both fields are filled
    
    // Generate a new ID (using a random string or increment logic)
    const newId = generateUniqueId(items);

    // Get the current date
    const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Add the new task to container1
    setItems((prevItems) => {
      return {
        ...prevItems,
        container3: [
          ...prevItems.container3,
          {
            id: newId,
            name: newTask,
            date: currentDate,
            note: newNote
          }
        ]
      };
    });

    // Reset the input fields
    setNewTask('');
    setNewNote('');
  };

  const generateUniqueId = (items: Items): string => {
    let newId: string;
    
    // Collect all existing IDs
    const allIds = Object.values(items)
      .flat()
      .map((item: TaskItem) => item.id);
    
    // Loop until we find a unique ID
    do {
      newId = Math.random().toString(36).substr(2, 9);
    } while (allIds.includes(newId));
  
    return newId;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
 
  const findContainer = (id: UniqueIdentifier) => {
    // First check if the id matches a container key itself
    if (id in items) {
      return id;
    }
    
    // Search through the containers to find the one that contains an item with the matching id
    return Object.keys(items).find((key: string) => 
      items[key].some(item => item.id === id.toString()) // Compare id of items
    );
  };

 
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id.toString();
  
    // Find the container where the dragged item is located
    const containerId = findContainer(id);
  
    // Find the dragged item by id
    if (containerId) {
      const draggedItem = items[containerId].find((item) => item.id === id);
      setActiveId(draggedItem?.id || null); // Store the active item’s id
    }
  };
  
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    const activeId = active.id.toString();
    const overId = over?.id?.toString();
  
    if (!overId) return;
  
    // Find which containers the active and over items are in
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);
  
    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }
  
    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
  
      // Find the indexes of the active and over items based on their id
      const activeIndex = activeItems.findIndex(item => item.id === activeId);
      const overIndex = overItems.findIndex(item => item.id === overId);
  
      if (activeIndex === -1 || overIndex === -1) return prev;
  
      let newIndex: number;
  
      // Check if we are moving over the container itself (moving to an empty container)
      if (overId in prev) {
        newIndex = overItems.length; // Move to the end of the target container
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1;
        const modifier = isBelowLastItem ? 1 : 0;
  
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length;
      }
  
      // Remove the active item from the current container
      const updatedActiveItems = activeItems.filter(item => item.id !== activeId);
  
      // Add the active item to the new container at the correct position
      const updatedOverItems = [
        ...overItems.slice(0, newIndex),
        activeItems[activeIndex], // Insert the active item
        ...overItems.slice(newIndex),
      ];
  
      // Return the updated items
      return {
        ...prev,
        [activeContainer]: updatedActiveItems, // Update the active container
        [overContainer]: updatedOverItems,     // Update the target container
      };
    });
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    const activeId = active.id.toString();
    const overId = over?.id?.toString();
  
    // If no `overId` or both IDs are missing, return early
    if (!overId || !activeId) return;
  
    // Find the containers for the active and over items
    const activeContainer = findContainer(activeId); // Where the item started
    const overContainer = findContainer(overId); // Where the item is dragged over
  
    // If containers are different or not found, move the item between containers
    if (!activeContainer || !overContainer || activeContainer !== overContainer) {
      setItems((prevItems) => {
        const activeIndex = prevItems[activeContainer].findIndex(item => item.id === activeId);
        const activeItem = prevItems[activeContainer][activeIndex];
  
        // Remove the item from the active container
        const updatedActiveItems = prevItems[activeContainer].filter((item) => item.id !== activeId);
  
        // Add the item to the new container
        const updatedOverItems = [...prevItems[overContainer], activeItem];
  
        return {
          ...prevItems,
          [activeContainer]: updatedActiveItems, // Update the active container
          [overContainer]: updatedOverItems, // Update the container where the item is moved
        };
      });
    } else {
      // If the item is dropped in the same container, reorder the items
      const activeIndex = items[activeContainer].findIndex(item => item.id === activeId);
      const overIndex = items[overContainer].findIndex(item => item.id === overId);
  
      if (activeIndex !== overIndex) {
        setItems((prevItems) => ({
          ...prevItems,
          [overContainer]: arrayMove(
            prevItems[overContainer], // Move items within the same container
            activeIndex,
            overIndex
          ),
        }));
      }
    }
  
    setActiveId(undefined); // Clear activeId after the drag ends
  };
  
  const deleteItem = (id: string) => {
    setItems((prevItems) => {
      const containerKey = findContainer(id);  // Find which container the item belongs to
      if (!containerKey) return prevItems;
  
      // Filter out the item with the given ID
      const updatedContainer = prevItems[containerKey].filter(item => item.id !== id);
  
      return {
        ...prevItems,
        [containerKey]: updatedContainer,  // Update the container with the filtered items
      };
    });
  };

  const saveAllTasks = async () => {
    if (!session) {
      toast({
        title: "You can't save tasks.",
        description: "Please sign in to save your tasks.",
        action: <ToastAction className='border-0' altText="Try again">
          <Button variant="default">
            <Link href='/signin'>Sign In</Link>
          </Button>
        </ToastAction>,
      })
      return;
    }
    const userId = session.user.id;
    const deleteResponse = await fetch(`/api/task?id=${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!deleteResponse.ok) {
        throw new Error("Failed to delete existing tasks");
    }
    // Iterate over each container key in the items object
    for (const containerKey in items) {
        if (Object.hasOwnProperty.call(items, containerKey)) {
            // Access the array of tasks within the current container
            const tasks = items[containerKey];
            // Iterate over each task within the current container
            for (const task of tasks) {
                try {
                    // Construct the request to save the task
                    const response = await fetch("/api/task", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: task.name,
                            note: task.note,
                            date: task.date,
                            userId: userId,  // User ID from session or passed explicitly
                            container: containerKey  // Use the key as the container ID
                        }),
                    });

                    const result = await response.json();
                    // Check the response status and handle errors
                    if (!response.ok) {
                        throw new Error(result.message || "Failed to save task");
                    }
                } catch (error) {
                    toast({
                        title: "Failed to save tasks",
                        description: error.message,
                        variant: "destructive",
                    });
                    return;
                }
            }
        }
    }
    toast({
      title: "Successfully saved tasks",
      description: "All tasks have been saved successfully.",
    })
};
// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
useEffect(() => {
    loadTasks();
}, [status])

if (loading) {
  return <div>Loading tasks...</div>;
}  
return (
    <div className="flex flex-col w-full px-1 md:px-2 xl:px-4 py-4">
      <div className='w-full flex justify-end p-2'>
        <button
          type="submit"
          className="w-fit sm:w-auto bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-blue-600 transition-all duration-300"
          onClick={() => {saveAllTasks();}}
        >
          {saveSuccess ? (
            <>
              <p>Saved</p> <FaCheckCircle />
            </>
          ) : (
            <>
              <p>Save Tasks</p> <FaRegSave />
            </>
          )}
        </button>
      </div>  
      <div className='w-full block md:flex'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Form to create tasks */}
        <div className='w-full md:w-1/3 block p-2 '>
          <h3 className="text-2xl font-bold text-center text-gray-800">Create New Task</h3>
          <form onSubmit={addTask} className="w-full flex flex-col gap-6 pt-4 px-6">
            {/* Task Name Input */}
            <div className="flex flex-col">
              <label htmlFor="taskName" className="text-sm font-medium text-gray-700">
                Task Name
              </label>
              <input
                type="text"
                id="taskName"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task name"
                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors placeholder-gray-400"
              />
            </div>

            {/* Task Note Input */}
            <div className="flex flex-col">
              <label htmlFor="taskNote" className="text-sm font-medium text-gray-700">
                Task Note
              </label>
              <input
                type="text"
                id="taskNote"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter task details"
                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors placeholder-gray-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              <p>Create Task</p>
              <FaPlus />
            </button>
          </form>
        </div>
        <div className='w-full md:w-2/3 grid grid-cols-2 p-2 rounded-xl'>
            <SortableContainer
            id="container1"
            label="Important, Not Urgent"
            items={items.container1 }
            color="bg-modern-orange"
            deleteItem={deleteItem}  
            />
            <SortableContainer
            id="container2"
            label="Important, Urgent"
            items={items.container2 }
            color="bg-modern-red"
            deleteItem={deleteItem}  
            />
            <SortableContainer
            id="container3"
            label="Not Important, Not Urgent"
            items={items.container3 }
            color="bg-modern-green"
            deleteItem={deleteItem}  
            />
            <SortableContainer
            id="container4"
            label="Not Important, Urgent"
            items={items.container4}
            color="bg-modern-blue"
            deleteItem={deleteItem}  
            />
        </div>
        {/* DragOverlay */}
        <DragOverlay>
          {activeItem ? (
            <SortableItem
              id={activeItem.id}
              name={activeItem.name}
              note={activeItem.note}
              date={activeItem.date}
              deleteItem={deleteItem}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
      </div>
    </div>
  );
};

export default Container;