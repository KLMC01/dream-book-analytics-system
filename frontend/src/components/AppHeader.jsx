import { Menu, LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from './Brand'
import ThemeToggle from './ThemeToggle'

export default function AppHeader({ onMenu, showDashboard = false }) {
  return (
    <header className="app-header glass">
      <button className="icon-button" onClick={onMenu} aria-label="Open menu"><Menu /></button>
      <Brand />
      <div className="header-actions">
        {showDashboard && (
          <Link className="secondary-button compact" to="/dashboard"><LayoutDashboard size={17} /> Dashboard</Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
