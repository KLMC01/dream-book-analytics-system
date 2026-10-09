import { Link, NavLink } from 'react-router-dom'
import Brand from './Brand'
import InstallButton from './InstallButton'
import ThemeToggle from './ThemeToggle'

export default function PublicNavbar() {
  return (
    <header className="public-nav-wrap">
      <nav className="public-nav glass">
        <Brand />
        <div className="nav-actions">
          <InstallButton />
          <NavLink className="nav-link" to="/about">About</NavLink>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
