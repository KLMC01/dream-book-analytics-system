import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, UploadCloud, Search, BarChart3, SlidersHorizontal, Sparkles, FileDown } from 'lucide-react'
import PublicNavbar from '../components/PublicNavbar'
import Footer from '../components/Footer'
import FeaturePreview from '../components/FeaturePreview'
import { analyses } from '../utils/analyses'

const systemFeatures = [
  { key: 'upload', title: 'Upload Data', text: 'Load your own CSV, Excel or JSON dataset.', icon: UploadCloud },
  { key: 'analyse', title: 'Analyse Data', text: 'Run the six Dream Book Shop analysis modules.', icon: Search },
  { key: 'visualise', title: 'Visualise Insights', text: 'Explore clear, responsive charts.', icon: BarChart3 },
  { key: 'filter', title: 'Filter Results', text: 'Focus on the years, languages and publishers you need.', icon: SlidersHorizontal },
  { key: 'interpret', title: 'Interpret Findings', text: 'Read calculated summaries alongside each chart.', icon: Sparkles },
  { key: 'report', title: 'Download Reports', text: 'Export the current analysis as a PDF report.', icon: FileDown },
]

export default function HomePage() {
  const [feature, setFeature] = useState('upload')
  return (
    <div className="page-shell">
      <PublicNavbar />
      <main>
        <section className="hero section-width">
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <span className="eyebrow">Dream Book Shop · Data Intelligence</span>
            <h1>Turn book data into <span>meaningful insight.</span></h1>
            <p>Explore publication history, authors, languages, publishers and data quality through a focused analysis workspace designed for the Dream Book Shop dataset.</p>
            <div className="hero-actions">
              <Link className="primary-button" to="/dashboard">Start Analysing <ArrowRight size={18} /></Link>
              <Link className="secondary-button" to="/about">Learn about the system</Link>
            </div>

          </motion.div>
        </section>

        <section className="section-width section-block">
          <div className="section-heading"><span className="eyebrow">What the system can do</span><h2>Built for a complete analysis workflow</h2><p>Move from raw dataset to a clear result without leaving the application.</p></div>
          <div className="feature-showcase">
            <FeaturePreview feature={feature} />
            <div className="feature-list">
              {systemFeatures.map(({ key, title, text, icon: Icon }) => (
                <button key={key} className={feature === key ? 'active' : ''} onMouseEnter={() => setFeature(key)} onFocus={() => setFeature(key)} onClick={() => setFeature(key)}>
                  <span className="feature-list-icon"><Icon /></span><span><strong>{title}</strong><small>{text}</small></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section-width section-block">
          <div className="section-heading"><span className="eyebrow">Analysis modules</span><h2>Six focused ways to explore the dataset</h2></div>
          <div className="analysis-card-grid">
            {analyses.map(({ key, title, description, icon: Icon, accent }) => (
              <Link key={key} to={`/analysis/${key}`} className="analysis-card glass-card">
                <span className={`icon-badge ${accent}`}><Icon /></span><h3>{title}</h3><p>{description}</p><span className="card-link">Open analysis <ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section-width home-cta glass-card">
          <div><span className="eyebrow">Ready to explore?</span><h2>Your sample dataset is already waiting.</h2><p>Open the dashboard, understand the sample, then replace it with your own compatible dataset whenever you are ready.</p></div>
          <Link className="primary-button" to="/dashboard">Start Analysing <ArrowRight size={18} /></Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
