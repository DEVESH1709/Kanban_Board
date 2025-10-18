# Kanban Board — React + Node.js + MongoDB

A simple yet powerful **Kanban Board application** built using  
**React (v19)**, **Tailwind CSS (v4)**, **Node.js (Express)**, and **MongoDB**.  

This project allows users to:
- Create, edit, delete, and move tasks between columns (`To Do`, `In Progress`, `Done`)
- Add and rename columns dynamically
- Drag and drop tasks between columns
- Persist data in **localStorage** and **MongoDB**
- Sync tasks automatically between frontend and backend

---

## Features

**Frontend (React + Tailwind)**  
- Built using React Hooks (`useState`, `useEffect`)  
- Responsive UI styled with Tailwind CSS  
- Columns and Tasks dynamically managed  
- Real-time drag-and-drop interaction  
- Uses Axios for backend communication  
- Data cached in `localStorage` for offline access  

**Backend (Node.js + Express + MongoDB)**  
- RESTful CRUD API (`/api/tasks`)  
- Mongoose ODM for schema & database management  
- `.env` configuration via dotenv  
- CORS-enabled for local development  
- Error-handled routes and optimistic UI updates  

## Installation & Setup

### 1️Clone the repository
```bash
git clone https://github.com/<your-username>/kanban-board.git
cd kanban-board
````

---

### Backend Setup

```bash
cd backend
npm install
```

#### Configure environment variables

Create a `.env` file (based on `.env.example`):

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/kanban?retryWrites=true&w=majority
```

#### Run backend server

```bash
npm run dev
```

You should see:

```
Connected to MongoDB
Server listening on port 5000
```

---

### Frontend Setup

```bash
cd ../frontend
npm install
```

#### Run React (Vite) development server

```bash
npm run dev
```

Your frontend will run on [http://localhost:5173](http://localhost:5173).
It will automatically connect to the backend at `http://localhost:5000/api/tasks`.

---

## Key Concepts

| Feature               | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| **LocalStorage Sync** | Saves tasks/columns locally for persistence.               |
| **MongoDB API**       | Permanent storage for tasks via Express routes.            |
| **Optimistic UI**     | Tasks appear immediately while API syncs in background.    |
| **Drag & Drop**       | HTML5 native drag events for moving tasks between columns. |
| **Dynamic Columns**   | Users can add, edit, and delete columns.                   |

---

## 📡 API Endpoints

| Method   | Endpoint         | Description                   |
| -------- | ---------------- | ----------------------------- |
| `GET`    | `/api/tasks`     | Fetch all tasks               |
| `POST`   | `/api/tasks`     | Create new task               |
| `PUT`    | `/api/tasks/:id` | Update task (title or status) |
| `DELETE` | `/api/tasks/:id` | Delete task                   |

---

## Technologies Used

### Frontend

* React 19.1.1
* Tailwind CSS 4.1.14
* Vite
* Axios

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* Dotenv
* CORS

---

##  LocalStorage Behavior

* All tasks and columns are saved locally to persist after reloads.
* If MongoDB connection fails, the app still works with local data.
* Once reconnected, local unsynced tasks are merged with backend tasks.

---

## Common Errors

** MongoDB Connection Error**
→ “Could not connect to any servers in your MongoDB Atlas cluster.”
 Fix: Go to Atlas → Network Access → Add IP `0.0.0.0/0` or “Add Current IP”.

** CORS Issue**
→ If frontend cannot call backend, add this to backend:

```js
app.use(cors({ origin: "http://localhost:5173" }));
```

## Example Workflow

1. Add a task → appears in “To Do”.
2. Drag it to “In Progress” → backend auto-updates.
3. Edit or Delete task → changes reflect instantly.
4. Add new column “Archive” → drag completed tasks there.
5. Refresh → data persists (local + MongoDB).

---

##  Available Scripts

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Run development server         |
| `npm run build` | Build production version       |
| `npm run start` | Start backend server           |
| `npm run lint`  | (Optional) Run linter if added |

---

## Deployment Tips

* **Frontend:** Deploy easily on **Vercel** or **Netlify**.
* **Backend:** Deploy to **Render**, **Railway**, or **Vercel Functions**.
* Make sure to update your frontend API base URL to your deployed backend endpoint.

---

##  Author

** Developer:** [Your Name]
** Contact:** [[your.email@example.com](mailto:your.email@example.com)]
** GitHub:** [github.com/your-username]

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

### Notes for Interviewer

* Code is modular, clean, and structured in a realistic production style.
* LocalStorage + API sync demonstrates robust offline-first architecture.
* Each commit follows logical development progression (backend → frontend → integration).

---
 like me to also include a **`README` version with emojis + better GitHub formatting (badges, live demo link placeholders, etc.)** — the kind that makes your repo look like a real open-source project?
```
