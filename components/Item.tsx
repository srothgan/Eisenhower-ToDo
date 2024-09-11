import type { UniqueIdentifier } from "@dnd-kit/core";
import React from "react";

const Item = ({ id, name, note, date }: { 
  id: UniqueIdentifier, 
  name: string, 
  note: string, 
  date: string 
}) => {
  return (
    <div className="w-full flex flex-col pl-2">
      <h4 className="font-semibold">{name}</h4>
      <p className="text-xs text-gray-600">Note: {note}</p>
      <p className="text-xs text-gray-500">Created at: {date}</p>
    </div>
  );
};

export default Item;
