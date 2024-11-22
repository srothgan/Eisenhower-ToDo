import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import React from "react";
const SortableContainer = ({
  id,
  items,
  label,
  color,
  height,
  deleteItem  
}: {
  id: string;
  items: { id: string; name: string; date: string; note: string }[]; // Updated type for items
  label: string;
  color: string;
  height : string;
  deleteItem: (id: string) => void;  // Add deleteItem function type
}) => {
  const { setNodeRef } = useDroppable({
    id,
  });
  return (
    <div className={`w-full ${color} p-1 md:p-2`}>
      <div className=' pt-2'>
        <h3 className="text-xl font-bold text-center text-label-gray">{label}</h3>
      </div>
      
      <SortableContext id={id} items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
        <div ref={setNodeRef} className={`w-full h-[300px] md:h-[250px] lg:h-[300px] overflow-auto`}>
          {items.map((item) => (
            <SortableItem 
              key={item.id} 
              id={item.id} 
              name={item.name} 
              note={item.note} 
              date={item.date} 
              deleteItem={deleteItem}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default SortableContainer;