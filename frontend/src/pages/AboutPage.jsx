import { Link } from 'react-router-dom'
import { ArrowRight, Database, LineChart, ShieldCheck, Smartphone, Layers3, FileDown } from 'lucide-react'
import PublicNavbar from '../components/PublicNavbar'
import Footer from '../components/Footer'

export default function AboutPage() {
  const values = [
    [Database, 'Flexible data loading', 'Start with the supplied sample or replace it with CSV, Excel or JSON data using a consistent book-data structure.'],
    [LineChart, 'Focused analytics', 'The six modules directly cover publication trends, authors, languages, publishers, ISBN completeness and year-by-language analysis.'],
    [Layers3, 'Clear architecture', 'React handles the interface while Django and pandas provide reusable analysis services behind a REST API.'],
    [FileDown, 'Portable reports', 'Each analysis can be exported to a PDF containing the filters, summary, visualization, table and interpretation.'],
    [Smartphone, 'Installable PWA', 'Use the application responsively in a browser and install it on supported desktop and mobile devices.'],
    [ShieldCheck, 'Local development first', 'Uploaded data is stored by the local Django development server for the current project environment.'],
  ]
  return (
    <div className="page-shell">
      <PublicNavbar />
      <main className="section-width about-page">
        <section className="about-hero about-hero-home-position">
          <span className="eyebrow">About the project</span>
          <h1>A modern analysis workspace for <span>Dream Book Shop.</span></h1>
          <p>The system turns bibliographic records into readable visual evidence. It is designed around the analysis requirements of the Dream Book Shop coursework while presenting them through a clean, responsive web experience.</p>
          <Link className="primary-button" to="/dashboard">Start Analysing <ArrowRight size={18} /></Link>
        </section>
        <section className="about-story glass-card">
          <div>
            <span className="eyebrow">How it works</span>
            <h2>From dataset to insight</h2>
          </div>

          <div className="process-flow">
            <div className="process-track" aria-hidden="true">
              <span className="process-track-fill" />
              <span className="process-runner" />
            </div>

            <div className="process-row">
              {[
                'Load a dataset',
                'Choose an analysis',
                'Refine filters',
                'Read the result',
                'Export the report',
              ].map((step, i) => (
                <div
                  key={step}
                  className="process-step"
                  style={{ '--step-delay': `${i * 1.2}s` }}
                >
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="about-capabilities">
          <div className="section-heading">
            <span className="eyebrow">System capabilities</span>
            <h2>Everything you need for a complete analysis workflow</h2>
            {/* <p>
              From loading datasets to exporting reports, the system brings the complete
              analysis process into one responsive workspace.
            </p> */}
          </div>

          <div className="about-grid">
            {values.map(([Icon, title, text]) => (
              <article key={title} className="glass-card">
                <span className="icon-badge blue">
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        
        <section className="about-tech glass-card">
          <div><span className="eyebrow">Technology</span><h2>Built with a practical full-stack structure</h2></div>
          <div className="tech-pills">{['React', 'React Router', 'Chart.js', 'Framer Motion', 'Django', 'Django REST Framework', 'pandas', 'ReportLab', 'PWA'].map(x => <span key={x}>{x}</span>)}</div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
