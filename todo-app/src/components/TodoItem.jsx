import { useState } from 'react'
import { STATUSES } from '../constants.js'

// Shared attributes for the small line icons.
const iconProps = {
  width: 15,
  height: 15,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

function TodoItem({
  todo,
  selected,
  onToggleSelect,
  onUpdate,
  onDelete,
  dragProps,
  isDragOver,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(todo.title)

  function startEditing() {
    setDraftTitle(todo.title)
    setIsEditing(true)
  }

  function saveTitle() {
    if (draftTitle.trim()) {
      onUpdate(todo.id, { title: draftTitle.trim() })
    }
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') saveTitle()
    if (e.key === 'Escape') setIsEditing(false)
  }

  const statusClass = todo.status.replace(' ', '-').toLowerCase()
  const classes = ['todo-item', `status-${statusClass}`]
  if (selected) classes.push('selected')
  if (isDragOver) classes.push('drag-over')

  return (
    <li className={classes.join(' ')} draggable={!isEditing} {...dragProps}>
      <span className="drag-handle" aria-hidden="true" title="Drag to reorder">
        ⋮⋮
      </span>

      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggleSelect(todo.id)}
        aria-label={`Select ${todo.title}`}
      />

      <button
        className={todo.starred ? 'icon-btn star on' : 'icon-btn star'}
        onClick={() => onUpdate(todo.id, { starred: !todo.starred })}
        aria-label={todo.starred ? 'Unstar' : 'Star'}
        aria-pressed={todo.starred}
      >
        {todo.starred ? '★' : '☆'}
      </button>

      {isEditing ? (
        <input
          className="edit-input"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={handleKeyDown}
          autoFocus
          aria-label="Edit title"
        />
      ) : (
        <span className="todo-title" onDoubleClick={startEditing} title="Double-click to edit">
          {todo.title}
        </span>
      )}

      <span className="status">
        <span className="status-dot" aria-hidden="true" />
        <select
          className="status-select"
          value={todo.status}
          onChange={(e) => onUpdate(todo.id, { status: e.target.value })}
          aria-label="Change status"
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </span>

      <div className="item-actions">
        {!isEditing && (
          <button className="icon-btn" onClick={startEditing} aria-label="Edit">
            <svg {...iconProps}>
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
        )}
        <button className="icon-btn delete" onClick={() => onDelete(todo.id)} aria-label="Delete">
          <svg {...iconProps}>
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
          </svg>
        </button>
      </div>
    </li>
  )
}

export default TodoItem
