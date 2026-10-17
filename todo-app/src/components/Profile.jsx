import { useState } from 'react'

function Profile({ profile, onSave, onClose }) {
  // Edit a local copy so changes only apply when the user clicks Save.
  const [draft, setDraft] = useState(profile)

  function handleChange(e) {
    setDraft({ ...draft, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!draft.name.trim()) return
    onSave({ ...draft, name: draft.name.trim() })
  }

  return (
    <section className="card profile">
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={draft.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={draft.email} onChange={handleChange} />
        </label>
        <label>
          Role
          <input name="role" value={draft.role} onChange={handleChange} />
        </label>
        <div className="actions">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    </section>
  )
}

export default Profile
