import React from 'react'
import {useState} from 'react'

function App() {

  const [task,setTasks] = useState([]);
 

  return (
   <div className="app-root min-h-screen bg-white">
   <header className="app-header px-6 py-4 border-b border-gray-200">
<div className="flex items-center gap-4">
<h1 className="text-2xl font-bold">Kanban Board (Styling)</h1>
</div>
   </header>

   <div>

   </div>

   </div>
  )
}

export default App
