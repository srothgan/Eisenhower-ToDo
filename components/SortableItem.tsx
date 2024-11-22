import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaRegCircle, FaTrashAlt } from 'react-icons/fa';

const SortableItem = ({ id, name, note, date, deleteItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  // Format the date using Intl.DateTimeFormat
  const formattedDate = date
  .split("T")[0]
  .split("-")
  .reverse()
  .join(".");

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
      }}
      className="w-full flex items-center justify-between my-1 md:my-2 py-1 md:py-2 px-2 md:px-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300"
    >

      {/* Item Content */}
      <div className="flex-1 flex flex-col pr-2" {...attributes} {...listeners}>
        <p className="text-md font-semibold text-gray-800">{name}</p>
        <p className="text-sm text-gray-600">{note}</p>
        <p className="text-xs text-gray-500">Created at: {formattedDate}</p>
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={() => deleteItem(id.toString())}
        className="text-red-500 hover:text-red-700 transition-colors duration-200"
        aria-label="Delete item"
      >
        <FaTrashAlt />
      </button>
    </div>
  );
};

export default SortableItem;
