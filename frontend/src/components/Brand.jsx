import { Link } from 'react-router-dom'

export default function Brand({ compact = false }) {
  return (
    <Link className="brand" to="/" aria-label="Dream Book Shop home">
      <img
        src="/images/dream-book-shop-logo.png"
        alt="Dream Book Shop logo"
        className={`brand-logo ${compact ? 'brand-logo-compact' : ''}`}
      />

      {!compact && (
        <span className="brand-name">
          Dream Book Shop
        </span>
      )}
    </Link>
  )
}