// The three statuses a todo can have, in display order.
export const STATUSES = ['To Do', 'In Progress', 'Done']

// The API stores statuses as codes; the UI shows these labels.
const LABEL_BY_CODE = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }
const CODE_BY_LABEL = { 'To Do': 'TODO', 'In Progress': 'IN_PROGRESS', Done: 'DONE' }

export function statusToApi(label) {
  return CODE_BY_LABEL[label]
}

// Shape of one todo item in the UI:
// { id: number, title: string, status: 'To Do' | 'In Progress' | 'Done', starred: boolean }
// starred only lives in the browser for now; the API doesn't store it yet.
export function fromApi(todo) {
  return { ...todo, status: LABEL_BY_CODE[todo.status] ?? todo.status, starred: false }
}
