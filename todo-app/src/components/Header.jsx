function Header({ profile, onOpenProfile }) {
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="header">
      <h1>My Todos</h1>
      <button
        className="user-chip"
        onClick={onOpenProfile}
        title={profile.name || 'Guest'}
        aria-label={`Edit profile for ${profile.name || 'Guest'}`}
      >
        <span className="avatar">{initials || '?'}</span>
      </button>
    </header>
  )
}

export default Header
