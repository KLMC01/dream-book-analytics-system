import { BookOpen, Users, Building2, Languages } from 'lucide-react'

export default function KpiCards({ dataset }) {
  const cards = [
    { label: 'Total Books', value: dataset?.total_books, note: 'Records in active dataset', Icon: BookOpen, accent: 'blue' },
    { label: 'Unique Authors', value: dataset?.unique_authors, note: 'Distinct author names', Icon: Users, accent: 'green' },
    { label: 'Publishers', value: dataset?.publishers_count, note: 'Distinct publishers', Icon: Building2, accent: 'violet' },
    { label: 'Languages', value: dataset?.languages_count, note: 'Publication languages', Icon: Languages, accent: 'orange' },
  ]
  return (
    <div className="kpi-grid">
      {cards.map(({ label, value, note, Icon, accent }) => (
        <article key={label} className="kpi-card glass-card">
          <span className={`icon-badge ${accent}`}><Icon /></span>
          <div><span>{label}</span><strong>{value == null ? '—' : Number(value).toLocaleString()}</strong><small>{note}</small></div>
        </article>
      ))}
    </div>
  )
}
