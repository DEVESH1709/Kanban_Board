import React from 'react';

export default function Modal ({title, children,onClose}){
    return (
        <div className = "fixed inset-0 bg-black/45 flex items-center justify-center z-50" onMouseDown ={onClose}>
        <div className="bg-white rounded-lg w-[520px] max-w-full shadow-2xl" onMouseDown={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="text-2xl cursor-pointer" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
        </div>
    )
}