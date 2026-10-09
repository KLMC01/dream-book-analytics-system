import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      <span className={`theme-thumb ${theme}`}>
        {theme === 'light' ? <Sun size={15} /> : <Moon size={15} />}
      </span>
    </button>
  )
}
