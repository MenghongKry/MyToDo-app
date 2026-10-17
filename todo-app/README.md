# Todo List App

A simple Todo List built with React and Vite. All data lives in React state, so there is no backend or database, and todos reset when you refresh the page.

## Run it

You need Node 18 or newer.

```bash
npm install
npm run dev
```

Then open the address it prints (usually http://localhost:5173).

Other scripts:

- `npm run build` builds a production version into `dist/`
- `npm run preview` serves that build locally
- `npm run lint` checks the code with ESLint

## Features

### Core

- Each todo has a **title** and a **status**: To Do, In Progress or Done
- The **username** is shown in the header ("Hi, Hong")
- A **profile** form (name, email, role) opens when you click the username
- Full **CRUD** in local state:
  - **Create:** type a title, pick a status, press Add or Enter
  - **Read:** the list shows every todo with a coloured status badge
  - **Update:** double-click a title (or press ✏️) to rename it; change the status from its badge dropdown
  - **Delete:** press 🗑️

### Bonus

1. **Multi-select:** tick todos (or Select all), then change their status or delete them together
2. **Filter by status:** All / To Do / In Progress / Done tabs, with counts
3. **Search:** filter by title as you type
4. **Drag and drop:** drag a todo by its ⋮⋮ handle to reorder it
5. **Priority:** star a todo with ☆, and see starred ones in the ⭐ Starred tab

## How the code is organised

```
src/
├── App.jsx              all state and the CRUD, bulk and reorder functions
├── constants.js         the list of statuses and createTodo()
├── App.css / index.css  styles (light and dark mode)
└── components/
    ├── Header.jsx       title and username chip
    ├── Profile.jsx      profile form
    ├── TodoForm.jsx     add-a-todo form
    ├── FilterBar.jsx    status tabs and search box
    ├── BulkBar.jsx      select all and bulk actions
    ├── TodoList.jsx     the list and drag-and-drop handling
    └── TodoItem.jsx     one row: select, star, edit, status, delete
```

A todo looks like this:

```js
{ id: '…', title: 'Buy milk', status: 'To Do', starred: false }
```

`App.jsx` holds the `todos` array in `useState`. Child components never change it directly. They call functions passed down as props (`addTodo`, `updateTodo`, `deleteTodo`, `bulkSetStatus`, `bulkDelete`, `reorderTodos`), and each of those builds a new array and calls `setTodos`.

Filtering and search don't change the data. `App.jsx` works out `visibleTodos` from `todos`, the selected tab and the search text on every render.

Bulk actions only affect selected todos that are currently visible, so a filter can't hide something you're about to delete.

Drag and drop uses the browser's built-in drag events (`onDragStart`, `onDragOver`, `onDrop`), with no extra library.
