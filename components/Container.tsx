"use client"
import React, { useState } from "react";
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
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import SortableContainer from "./SortableContainer";
import Item from "./Item";
import { FaPlus } from "react-icons/fa6";
import SortableItem from "./SortableItem";

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
    container1: [
      { id: '1', name: 'Do something', date: '2024-09-11', note: 'Important task' },
      { id: '2', name: 'Do nothing', date: '2024-09-12', note: 'Take a rest' },
      { id: '3', name: 'Eat something', date: '2024-09-13', note: 'Lunch with friends' },
      { id: '4', name: 'Drink something', date: '2024-09-14', note: 'Stay hydrated' },
    ],
    container2: [],
    container3: [],
    container4: [],
    container5: [],
  });

  const [activeId, setActiveId] = useState<UniqueIdentifier>();

  // Find the active item based on the activeId
  const activeItem = activeId
    ? Object.values(items)
        .flat()
        .find((item) => item.id === activeId)
    : null;

  const [newTask, setNewTask] = useState("");
  const [newNote, setNewNote] = useState("");

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
        container1: [
          ...prevItems.container1,
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
    console.log("Task Added:", newTask, newNote);  // Log the added task
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
  return (
    <div className="flex flex-col w-full p-4">
      <div className='p-2 block'>
        <h3 className="text-xl font-bold text-center">Create new Task</h3>
        <form onSubmit={addTask} className="w-full flex flex-col md:flex-row gap-4 pt-2">
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter a name"
                className="w-full p-3 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter a note"
              className="w-full p-3 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button type="submit" className="w-full md:w-fit bg-blue-500 text-white p-2 rounded-lg border-2 border-gray-300 flex items-center justify-center">
              <FaPlus/>
            </button>
        </form>
      </div>  
      <div className='w-full block md:flex'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* SortableContainer */}
        <div className='w-full md:w-1/3 block p-2 '>
            <SortableContainer
            id="container1"
            items={items.container1}
            label="Unassigned"
            color="bg-white"
            height="h-[250px] md:h-[550px]"
            deleteItem={deleteItem}  
            />
        </div>
        <div className='w-full md:w-2/3 flex flex-col md:grid grid-cols-2 m-2 rounded-xl'>
            <SortableContainer
            id="container2"
            label="Important, Not Urgent"
            items={items.container2}
            color="bg-modern-orange"
            height=" h-[250px]"
            deleteItem={deleteItem}  
            />
            <SortableContainer
            id="container3"
            label="Important, Urgent"
            items={items.container3}
            color="bg-modern-red"
            height=" h-[250px]"
            deleteItem={deleteItem}  
            />
            <SortableContainer
            id="container4"
            label="Not Important, Not Urgent"
            items={items.container4}
            color="bg-modern-green"
            height=" h-[250px]"
            deleteItem={deleteItem}  
            />
            <SortableContainer
            id="container5"
            label="Not Important, Urgent"
            items={items.container5}
            color="bg-modern-blue"
            height=" h-[250px]"
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