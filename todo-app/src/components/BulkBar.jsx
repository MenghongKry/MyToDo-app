import { STATUSES } from '../constants.js'

function BulkBar({ visibleCount, selectedCount, onToggleAll, onBulkStatus, onBulkDelete }) {
  const allSelected = visibleCount > 0 && selectedCount === visibleCount

  return (
    <div className="bulk-bar">
      <label className="select-all">
        <input
          type="checkbox"
          checked={allSelected}
          ref={(el) => {
            // Show a dash when only some items are selected.
            if (el) el.indeterminate = selectedCount > 0 && !allSelected
          }}
          onChange={() => onToggleAll(!allSelected)}
          disabled={visibleCount === 0}
        />
        {selectedCount > 0 ? `${selectedCount} selected` : 'Select all'}
      </label>

      {selectedCount > 0 && (
        <div className="bulk-actions">
          <select
            value=""
            onChange={(e) => onBulkStatus(e.target.value)}
            aria-label="Set status for selected"
          >
            <option value="" disabled>
              Set status…
            </option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button className="danger" onClick={onBulkDelete}>
            Delete selected
          </button>
        </div>
      )}
    </div>
  )
}

export default BulkBar
