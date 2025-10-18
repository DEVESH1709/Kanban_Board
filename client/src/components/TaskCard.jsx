import React from 'react';
import {FiEdit, FiTrash2} from 'react-icons/fi'

export default function TaskCard ({task,onEdit,onDelete}){
    function handleDragStart(e){
        e.dataTransfer.setData('taskId', task._id)
    }

    return (
        <div className = "bg-white rounded shadow cursor-move border border-emerald-100 overflow-hidden"
         draggble
         onDragStart ={handleDragStart}
        >
    <div className="bg-green-200 rounded-t px-4 py-3 flex justify-between items-center">
        <strong>{task.title}</strong>
        <div className="flex items-center gap-2">
          <button
            type="button"
            draggable={false}
            onClick={e => {
              e.stopPropagation()
              const newTitle = prompt('Edit task title:', task.title)
              if (newTitle) onEdit(newTitle)
            }}
            className="p-1 rounded hover:bg-green-100"
            aria-label="Edit task"
          ><FiEdit /></button>
          <button
            type="button"
            draggable={false}
            onClick={e => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1 rounded hover:bg-green-100"
            aria-label="Delete task"
          ><FiTrash2 /></button>
        </div>
      </div>
      <div className="px-4 py-4 text-sm text-gray-700">
        {task.description || ''}
      </div>
        </div>
    )
}