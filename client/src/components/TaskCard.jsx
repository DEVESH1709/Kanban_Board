import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function TaskCard({ task, onEdit, onDelete, onStartEdit }) {
  function handleDragStart(e) {
    e.dataTransfer.setData("taskId", task._id);
  }

  return (
    <div
      className="bg-white rounded shadow cursor-move border border-emerald-100 overflow-hidden"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="bg-green-200 rounded-t px-4 py-3 flex justify-between items-center gap-2">
        <strong className = "block truncate">{task.title}</strong>
        <div className="flex items-center gap-2 flex-none">
          <button
            type="button"
            draggable={false}
            onClick={(e) => {
              e.stopPropagation();
              if (onStartEdit) onStartEdit(task);
              else {
                const newTitle = prompt("Edit task title:", task.title);
                if (newTitle && onEdit) onEdit(newTitle);
              }
            }}
            className="p-1 rounded hover:bg-green-100 cursor-pointer"
            aria-label="Edit task"
          >
            <FiEdit />
          </button>
          <button
            type="button"
            draggable={false}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded hover:bg-green-100 cursor-pointer"
            aria-label="Delete task"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
      <div className="px-4 py-4 text-sm text-gray-700">
        {task.description || ""}
      </div>
    </div>
  );
}
