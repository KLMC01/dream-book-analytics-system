import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Download, LayoutDashboard, RefreshCw, SlidersHorizontal, Table2 } from 'lucide-react'
import { toast } from 'sonner'
import AppHeader from '../components/AppHeader'
import MenuDrawer from '../components/MenuDrawer'
import DatasetDropzone from '../components/DatasetDropzone'
import AnalysisFilters from '../components/AnalysisFilters'
import AnalysisChart from '../components/AnalysisChart'
import ResultTable from '../components/ResultTable'
import Footer from '../components/Footer'
import { useDataset } from '../context/DatasetContext'
import { analysisMap } from '../utils/analyses'

function queryString(datasetId, filters) {
  const params = new URLSearchParams({ dataset_id: datasetId })
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value != null) params.set(key, value)
  })
  return params.toString()
}

export default function AnalysisPage() {
  const API_URL = import.meta.env.VITE_API_URL || ''
  const { analysisType } = useParams()
  const navigate = useNavigate()
  const config = analysisMap[analysisType]
  const analysisOptions = Object.entries(analysisMap)
  const { dataset, loadingDataset } = useDataset()
  const [menuOpen, setMenuOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState({})
  const [filters, setFilters] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [chartType, setChartType] = useState(null)

  useEffect(() => {
    setDraftFilters({})
    setFilters({})
    setResult(null)
    setChartType(null)
  }, [analysisType])

  const fetchAnalysis = useCallback(async () => {
    if (!dataset?.dataset_id || !config) return
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/analyses/${analysisType}/?${queryString(dataset.dataset_id, filters)}`)
      const body = await response.json()
      if (!response.ok) throw new Error(body.detail || 'Could not run analysis.')
      setResult(body)
      setChartType((current) => body.allowed_charts.includes(current) ? current : body.default_chart)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [dataset?.dataset_id, config, analysisType, filters])

  useEffect(() => { fetchAnalysis() }, [fetchAnalysis])

  const applyFilters = () => setFilters({ ...draftFilters })
  const resetFilters = () => { setDraftFilters({}); setFilters({}) }

  const downloadReport = async () => {
    if (!result) return
    toast.loading('Generating report…', { id: 'report' })
    try {
      const response = await fetch(`${API_URL}/api/reports/analysis/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset_id: dataset.dataset_id, analysis_type: analysisType, filters, chart_type: chartType }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.detail || 'Could not generate report.')
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dream-book-shop-${analysisType}-report.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('Report downloaded', { id: 'report' })
    } catch (error) {
      toast.error(error.message, { id: 'report' })
    }
  }

  if (!config) return <div className="center-message">Unknown analysis. <Link to="/dashboard">Return to dashboard</Link>.</div>

  return (
    <div className="page-shell app-page">
      <AppHeader onMenu={() => setMenuOpen(true)} showDashboard />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="section-width analysis-page">
        <div className="analysis-title-row">
          <div className="analysis-title-content">
            <div className="breadcrumbs">
              <Link to="/dashboard"><LayoutDashboard size={14} /> Dashboard</Link>
              <span>/</span>
              <span>{config.title}</span>
            </div>

            <h1>{config.longTitle}</h1>
            <p>{config.description}</p>

            <div className="analysis-top-controls">
              <label className="analysis-switcher">
                <span>Change analysis</span>
                <select
                  value={analysisType}
                  onChange={(event) => navigate(`/analysis/${event.target.value}`)}
                  aria-label="Change analysis"
                >
                  {analysisOptions.map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="analysis-load-dataset">
                <DatasetDropzone
                  compact
                  onUploaded={() => {
                    setDraftFilters({})
                    setFilters({})
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {result && <AnalysisFilters analysisType={analysisType} dataset={dataset} filters={draftFilters} setFilters={setDraftFilters} chartType={chartType} setChartType={setChartType} allowedCharts={result.allowed_charts} />}
        <div className="filter-actions"><button className="primary-button small" onClick={applyFilters}><SlidersHorizontal size={15} /> Apply filters</button><button className="text-button" onClick={resetFilters}><RefreshCw size={15} /> Reset filters</button></div>

        <section className="analysis-layout">
          <article className="chart-card glass-card">
            <div className="card-heading"><div><span className="eyebrow">Visualization</span><h2>{result?.title || config.longTitle}</h2></div><span className="dataset-chip">{dataset?.filename || 'Dataset'}</span></div>
            <div className="chart-stage">{loading ? <div className="chart-loader"><div className="spinner" /><span>Updating analysis…</span></div> : <AnalysisChart result={result} chartType={chartType} />}</div>
          </article>

          <aside className="analysis-side glass-card">
            <span className="eyebrow">Summary</span><h2>At a glance</h2>
            <div className="summary-list">{result?.summary?.map(item => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>
          </aside>
        </section>

        <section className="analysis-bottom-grid">
          <article className="interpretation-card glass-card"><span className="eyebrow">Interpretation</span><h2>What the result suggests</h2><p>{result?.interpretation || 'Run the analysis to generate an interpretation.'}</p></article>
          <article className="table-card glass-card"><div className="card-heading"><div><span className="eyebrow">Analysis data</span><h2><Table2 size={20} /> Result table</h2></div></div><ResultTable rows={result?.table || []} /></article>
        </section>

        <div className="report-row"><button className="primary-button large" onClick={downloadReport} disabled={!result || loading}><Download size={19} /> Download Report</button></div>
        {(loadingDataset) && <div className="loading-overlay"><div className="spinner" /><span>Loading dataset…</span></div>}
      </main>
      <Footer />
    </div>
  )
}
