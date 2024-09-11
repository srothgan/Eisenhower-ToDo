import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import React from "react";
const SortableContainer = ({
  id,
  items,
  label,
  color,
  height
}: {
  id: string;
  items: { id: string; name: string; date: string; note: string }[]; // Updated type for items
  label: string;
  color: string;
  height : string
}) => {
  const { setNodeRef } = useDroppable({
    id,
  });
  return (
    <div className={`w-full ${color} text-black p-2 `}>
      <div className=' pt-2'>
        <h3 className="text-xl font-bold text-center">{label}</h3>
      </div>
      
      <SortableContext id={id} items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
        <div ref={setNodeRef} className={`w-full ${height} overflow-auto`}>
          {items.map((item) => (
            <SortableItem 
              key={item.id} 
              id={item.id} 
              name={item.name} 
              note={item.note} 
              date={item.date} 
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default SortableContainer;