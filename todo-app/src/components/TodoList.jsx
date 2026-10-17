import { useState } from 'react'
import TodoItem from './TodoItem.jsx'

function TodoList({ todos, emptyMessage, selectedIds, onToggleSelect, onUpdate, onDelete, onReorder }) {
  // Drag and drop with the browser's built-in drag events.
  const [draggedId, setDraggedId] = useState(null)
  const [overId, setOverId] = useState(null)

  if (todos.length === 0) {
    return <p className="empty">{emptyMessage}</p>
  }

  function dragPropsFor(id) {
    return {
      onDragStart: (e) => {
        setDraggedId(id)
        e.dataTransfer.effectAllowed = 'move'
      },
      onDragOver: (e) => {
        e.preventDefault() // required so the item accepts a drop
        if (overId !== id) setOverId(id)
      },
      onDrop: (e) => {
        e.preventDefault()
        if (draggedId && draggedId !== id) onReorder(draggedId, id)
        setDraggedId(null)
        setOverId(null)
      },
      onDragEnd: () => {
        setDraggedId(null)
        setOverId(null)
      },
    }
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selected={selectedIds.includes(todo.id)}
          onToggleSelect={onToggleSelect}
          onUpdate={onUpdate}
          onDelete={onDelete}
          dragProps={dragPropsFor(todo.id)}
          isDragOver={overId === todo.id && draggedId !== todo.id}
        />
      ))}
    </ul>
  )
}

export default TodoList
