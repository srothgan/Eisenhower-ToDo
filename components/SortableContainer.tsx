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
  items: string[];
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
      
      <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`w-full${height} overflow-auto`}
        >
          {items.map((id: string) => (
            <SortableItem key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default SortableContainer;