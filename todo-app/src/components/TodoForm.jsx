import { useState } from 'react'
import { STATUSES } from '../constants.js'

function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState(STATUSES[0])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title, status)
    setTitle('')
    setStatus(STATUSES[0])
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Todo title"
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
        {STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <button type="submit" disabled={!title.trim()}>
        Add
      </button>
    </form>
  )
}

export default TodoForm
