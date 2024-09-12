import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { UniqueIdentifier } from "@dnd-kit/core";
import Item from "./Item";
import React from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";

const SortableItem = ({ id, name, note, date,deleteItem }: { 
  id: UniqueIdentifier, 
  name: string, 
  note: string, 
  date: string,
  deleteItem: (id: string) => void  // Add deleteItem function type
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="w-full flex items-center justify-between my-2 px-4 py-2 bg-slate-200 h-fit"
    >
      <button type="button" onClick={() => deleteItem(id.toString())}> 
      <FaRegCircle />
    </button>
      {/* Pass id, name, note, and date to Item */}
      <Item id={id} name={name} note={note} date={date} />
      <button {...attributes} {...listeners}><RxDragHandleDots2/></button>
    </div>
  );
};

export default SortableItem;
