import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function Column({
  name,
  children,
  onEditColumn,
  onDeleteColumn,
}) {
  return (
    <div className="flex-1 min-h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-4 gap-5 flex-none">
        <h2 className="font-semibold text-lg">{name}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            draggable={false}
            onClick={(e) => {
              e.stopPropagation();
              if (onEditColumn) onEditColumn();
            }}
            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
            aria-label="Edit column"
          >
            {" "}
            <FiEdit />
          </button>
          <button
            type="button"
            draggable={false}
            onClick={(e) => {
              e.stopPropagation();
              if (onDeleteColumn) onDeleteColumn();
            }}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Delete column"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      <div className="space-y-4 overflow-auto flex-1">{children}</div>
    </div>
  );
}
