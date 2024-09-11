import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { UniqueIdentifier } from "@dnd-kit/core";
import Item from "./Item";
import React from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";
const SortableItem = ({ id }: { id: UniqueIdentifier }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="w-full flex items-center justify-between my-2 px-4 bg-slate-200 h-[50px]"
    >
      <button type="button"><FaRegCircle/></button>
      <Item id={id} />
      <button {...attributes}
      {...listeners}><RxDragHandleDots2/></button>
    </div>
  );
};

export default SortableItem;