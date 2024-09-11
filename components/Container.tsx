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
const Container = () => {
 
  const [items, setItems] = useState<{
    [key: string]: string[];
  }>({
    container1: ["Do something", "Do nothing", "Eat something", "Drink something"],
    container2: [],
    container3: [],
    container4: [],
    container5: [],
  });

  const [activeId, setActiveId] = useState<UniqueIdentifier>();

  const [newTask, setNewTask] = useState("");

  const addTask = (event) => {
    event.preventDefault();  // Prevent the form from causing a page reload
    if (!newTask) return;    // Check if the input is not empty
    setItems(prevItems => {
        return {
            ...prevItems,
            container1: [...prevItems.container1, newTask]  // Append new task to container1
        };
    });
    setNewTask('');  // Reset newTask to empty for new input
    console.log("Task Added:", newTask);  // Log the added task
};

 
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

 
  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }
    return Object.keys(items).find((key: string) =>
      items[key].includes(id.toString())
    );
  };

 
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id.toString();
    setActiveId(id);
  };

  
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    const id = active.id.toString();
   
    const overId = over?.id;

    if (!overId) return;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(over?.id);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      
      const activeItems = prev[activeContainer];
      
      const overItems = prev[overContainer];
 
      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(overId.toString());

      let newIndex: number;
      if (overId in prev) {
        
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

 
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    const id = active.id.toString();
    
    const overId = over?.id;

    if (!overId) return;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(over?.id);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].indexOf(id);
    const overIndex = items[overContainer].indexOf(overId.toString());

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }
    setActiveId(undefined);
  };

  return (
    <div className="flex flex-row mx-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* SortableContainer */}
        <div className='w-1/3 block p-2 '>
        <form onSubmit={addTask} className="w-full flex gap-4">
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter a new task"
                className="w-full p-3 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button type="submit" className="w-fit bg-blue-500 text-white p-2 rounded-lg border-2 border-gray-300 rounded-lg">
                <FaPlus/>
            </button>
        </form>
            <SortableContainer
            id="container1"
            items={items.container1}
            label="Unassigned"
            color="bg-white"
            height=" h-[550px]"
            />
        </div>
        <div className='w-2/3 grid grid-cols-2 m-2 rounded-xl'>
            <SortableContainer
            id="container2"
            label="Important, Not Urgent"
            items={items.container2}
            color="bg-modern-orange"
            height=" h-[250px]"
            />
            <SortableContainer
            id="container3"
            label="Important, Urgent"
            items={items.container3}
            color="bg-modern-red"
            height=" h-[250px]"
            />
            <SortableContainer
            id="container4"
            label="Not Important, Not Urgent"
            items={items.container4}
            color="bg-modern-green"
            height=" h-[250px]"
            />
            <SortableContainer
            id="container5"
            label="Not Important, Urgent"
            items={items.container5}
            color="bg-modern-blue"
            height=" h-[250px]"
            />
        </div>
        {/* DragOverlay */}
        <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
};

export default Container;