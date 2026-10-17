const BASE = 'http://localhost:3000/api'

// fetch wrapper: sends JSON, throws on any non-2xx so callers can show an error.
async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: { 'Content-Type': 'application/json' },
    body: options.body && JSON.stringify(options.body),
  })
  if (!res.ok) throw new Error(`${options.method ?? 'GET'} ${path} failed (${res.status})`)
  return res.status === 204 ? null : res.json()
}

export const api = {
  getTodos: () => request('/todos'),
  createTodo: (todo) => request('/todos', { method: 'POST', body: todo }),
  updateTodo: (id, changes) => request(`/todos/${id}`, { method: 'PATCH', body: changes }),
  deleteTodo: (id) => request(`/todos/${id}`, { method: 'DELETE' }),
  getProfiles: () => request('/profile'),
  createProfile: (profile) => request('/profile', { method: 'POST', body: profile }),
  updateProfile: (id, changes) => request(`/profile/${id}`, { method: 'PATCH', body: changes }),
}
