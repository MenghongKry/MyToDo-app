import { STATUSES } from '../constants.js'

const FILTERS = ['All', ...STATUSES, 'Starred']

function FilterBar({ todos, filter, onFilterChange, search, onSearchChange }) {
  function countFor(f) {
    if (f === 'All') return todos.length
    if (f === 'Starred') return todos.filter((t) => t.starred).length
    return todos.filter((t) => t.status === f).length
  }

  return (
    <div className="filter-bar">
      <div className="tabs" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={filter === f ? 'tab active' : 'tab'}
            onClick={() => onFilterChange(f)}
          >
            {f} <span className="count">{countFor(f)}</span>
          </button>
        ))}
      </div>
      <input
        type="search"
        className="search"
        placeholder="Search by title…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search todos"
      />
    </div>
  )
}

export default FilterBar
