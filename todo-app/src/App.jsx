import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Profile from './components/Profile.jsx'
import TodoForm from './components/TodoForm.jsx'
import FilterBar from './components/FilterBar.jsx'
import BulkBar from './components/BulkBar.jsx'
import TodoList from './components/TodoList.jsx'
import { api } from './api.js'
import { fromApi, statusToApi } from './constants.js'
import './App.css'

const emptyProfile = { name: '', email: '', role: '' }
const defaultProfile = { name: 'Hong', email: 'hong@example.com', role: 'Student' }

// The app shows one profile: the first row, created on the first visit if the table is empty.
async function loadProfile() {
  const [first] = await api.getProfiles()
  return first ?? api.createProfile(defaultProfile)
}

function App() {
  const [profile, setProfile] = useState(emptyProfile)
  const [showProfile, setShowProfile] = useState(false)
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState([])

  // Load todos and the profile from the API once, when the page opens.
  useEffect(() => {
    Promise.all([api.getTodos(), loadProfile()])
      .then(([todoRows, profileRow]) => {
        setTodos(todoRows.map(fromApi))
        setProfile(profileRow)
      })
      .catch(() => setError('Could not reach the API. Is the NestJS server running on :3000?'))
      .finally(() => setLoading(false))
  }, [])

  // Run an API call; on failure show a message instead of crashing.
  async function call(action) {
    try {
      setError('')
      return await action()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleSaveProfile(updated) {
    const { name, email, role } = updated
    const saved = await call(() => api.updateProfile(profile.id, { name, email, role }))
    if (saved) {
      setProfile(saved)
      setShowProfile(false)
    }
  }

  // Create
  async function addTodo(title, status) {
    const created = await call(() =>
      api.createTodo({ title: title.trim(), status: statusToApi(status) }),
    )
    if (created) setTodos((current) => [...current, fromApi(created)])
  }

  // Update: title and status go to the API; starred stays in the browser for now.
  async function updateTodo(id, changes) {
    const body = { ...changes }
    delete body.starred
    if (Object.keys(body).length > 0) {
      if (body.status) body.status = statusToApi(body.status)
      const saved = await call(() => api.updateTodo(id, body))
      if (!saved) return
    }
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, ...changes } : todo)),
    )
  }

  // Delete
  async function deleteTodo(id) {
    const ok = await call(() => api.deleteTodo(id).then(() => true))
    if (!ok) return
    setTodos((current) => current.filter((todo) => todo.id !== id))
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id))
  }

  // Read: the todos that match the current filter tab and search box
  const query = search.trim().toLowerCase()
  const visibleTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Starred' ? todo.starred : todo.status === filter)
    return matchesFilter && todo.title.toLowerCase().includes(query)
  })

  // Bulk actions only touch selected todos that are currently visible,
  // so nothing hidden by a filter changes by surprise.
  const visibleSelectedIds = visibleTodos
    .filter((todo) => selectedIds.includes(todo.id))
    .map((todo) => todo.id)

  function toggleSelect(id) {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id],
    )
  }

  function toggleSelectAll(selectAll) {
    setSelectedIds(selectAll ? visibleTodos.map((todo) => todo.id) : [])
  }

  // Bulk actions send one request per selected todo.
  async function bulkSetStatus(status) {
    const ids = visibleSelectedIds
    const ok = await call(() =>
      Promise.all(ids.map((id) => api.updateTodo(id, { status: statusToApi(status) }))).then(
        () => true,
      ),
    )
    if (!ok) return
    setTodos((current) =>
      current.map((todo) => (ids.includes(todo.id) ? { ...todo, status } : todo)),
    )
    setSelectedIds([])
  }

  async function bulkDelete() {
    const ids = visibleSelectedIds
    const ok = await call(() => Promise.all(ids.map((id) => api.deleteTodo(id))).then(() => true))
    if (!ok) return
    setTodos((current) => current.filter((todo) => !ids.includes(todo.id)))
    setSelectedIds([])
  }

  // Move the dragged todo to the position of the todo it was dropped on.
  function reorderTodos(draggedId, targetId) {
    const from = todos.findIndex((todo) => todo.id === draggedId)
    const to = todos.findIndex((todo) => todo.id === targetId)
    const next = [...todos]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setTodos(next)
  }

  function changeFilter(next) {
    setFilter(next)
    setSelectedIds([])
  }

  const emptyMessage = loading
    ? 'Loading…'
    : todos.length === 0
      ? 'No todos yet. Add one above to get started.'
      : 'No todos match.'

  return (
    <div className="app">
      <Header profile={profile} onOpenProfile={() => setShowProfile(true)} />

      {showProfile && (
        <Profile
          profile={profile}
          onSave={handleSaveProfile}
          onClose={() => setShowProfile(false)}
        />
      )}

      <section className="card todo-card">
        {error && <p className="error">{error}</p>}
        <TodoForm onAdd={addTodo} />
        <FilterBar
          todos={todos}
          filter={filter}
          onFilterChange={changeFilter}
          search={search}
          onSearchChange={setSearch}
        />
        <BulkBar
          visibleCount={visibleTodos.length}
          selectedCount={visibleSelectedIds.length}
          onToggleAll={toggleSelectAll}
          onBulkStatus={bulkSetStatus}
          onBulkDelete={bulkDelete}
        />
        <TodoList
          todos={visibleTodos}
          emptyMessage={emptyMessage}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onReorder={reorderTodos}
        />
      </section>
    </div>
  )
}

export default App
