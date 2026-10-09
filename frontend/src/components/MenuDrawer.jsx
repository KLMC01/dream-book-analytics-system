import { AnimatePresence, motion } from 'framer-motion'
import { X, Home, Info, LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { analyses } from '../utils/analyses'

export default function MenuDrawer({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.aside className="drawer glass-strong" initial={{ x: '-105%', opacity: 0.6 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '-105%', opacity: 0 }} transition={{ type: 'spring', damping: 26, stiffness: 260 }} onClick={(e) => e.stopPropagation()}>
            <div className="drawer-top">
              <div><span className="eyebrow">Dream Book Shop</span><h2>Data Analysis</h2></div>
              <button className="icon-button" onClick={onClose} aria-label="Close menu"><X /></button>
            </div>
            <div className="drawer-links">
              <Link to="/" onClick={onClose}><Home size={18} /> Home</Link>
              <Link to="/dashboard" onClick={onClose}><LayoutDashboard size={18} /> Dashboard</Link>
              {analyses.map(({ key, title, icon: Icon }) => (
                <Link key={key} to={`/analysis/${key}`} onClick={onClose}><Icon size={18} /> {title}</Link>
              ))}
              <Link to="/about" onClick={onClose}><Info size={18} /> About</Link>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
