import type { UniqueIdentifier } from "@dnd-kit/core";
import React from "react";

const Item = ({ id }: { id: UniqueIdentifier }) => {
  return (
    <div className="w-full flex items-center justify-center ">
      {id}
    </div>
  );
};
export default Item;