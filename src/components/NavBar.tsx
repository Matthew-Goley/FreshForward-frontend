import { Link } from 'react-router-dom'
import { useApp } from '../lib/AppContext'

export default function NavBar() {
  const { currentUser, logout } = useApp()

  return (
    <nav className="flex flex-wrap items-center gap-4 border-b border-gray-300 px-4 py-3 text-sm">
      <Link to="/">FreshForward</Link>
      <Link to="/browse">Browse Listings</Link>
      <Link to="/restaurant/apply">Restaurant Application</Link>
      {currentUser?.accountType === 'restaurant' && <Link to="/restaurant/dashboard">Dashboard</Link>}

      <div className="ml-auto flex items-center gap-4">
        {currentUser ? (
          <>
            <span>Logged in as {currentUser.email}</span>
            <button onClick={logout} className="border border-gray-400 px-3 py-1">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
