import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarRange } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import MenuDrawer from '../components/MenuDrawer'
import DatasetDropzone from '../components/DatasetDropzone'
import KpiCards from '../components/KpiCards'
import Footer from '../components/Footer'
import { analyses } from '../utils/analyses'
import { useDataset } from '../context/DatasetContext'

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { dataset, loadingDataset } = useDataset()
  return (
    <div className="page-shell app-page">
      <AppHeader onMenu={() => setMenuOpen(true)} />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="section-width dashboard-page">
        <div className="page-title-row">
          <div><span className="eyebrow">Analysis workspace</span><h1>Data Analysis System</h1></div>
          {dataset?.min_year && <div className="range-chip"><CalendarRange size={17} /> {dataset.min_year}–{dataset.max_year}</div>}
        </div>
        <KpiCards dataset={dataset} />
        <DatasetDropzone />
        <section className="dashboard-insights">
          <div className="section-heading left"><span className="eyebrow">Generate insights</span><h2>Choose an analysis</h2><p>Every module uses the currently active dataset.</p></div>
          <div className="analysis-card-grid dashboard-grid">
            {analyses.map(({ key, title, description, icon: Icon, accent }) => (
              <Link key={key} to={`/analysis/${key}`} className="analysis-card glass-card">
                <span className={`icon-badge ${accent}`}><Icon /></span><h3>{title}</h3><p>{description}</p><span className="card-link">Analyse <ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
        </section>
        {loadingDataset && <div className="loading-overlay"><div className="spinner" /><span>Preparing dataset…</span></div>}
      </main>
      <Footer />
    </div>
  )
}
