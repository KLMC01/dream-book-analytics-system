import { motion } from 'framer-motion'
import { UploadCloud, SlidersHorizontal, FileDown, Sparkles, BarChart3, Search } from 'lucide-react'

const previewData = {
  upload: { icon: UploadCloud, title: 'Drop a dataset', subtitle: 'CSV · XLSX · XLS · JSON', kind: 'upload' },
  analyse: { icon: Search, title: 'Six focused analyses', subtitle: 'From publication trends to ISBN quality', kind: 'cards' },
  visualise: { icon: BarChart3, title: 'Interactive visualisations', subtitle: 'Switch chart types when the analysis allows it', kind: 'chart' },
  filter: { icon: SlidersHorizontal, title: 'Refine your view', subtitle: 'Years, languages, publishers and Top N controls', kind: 'filters' },
  interpret: { icon: Sparkles, title: 'Understand the result', subtitle: 'Calculated summaries and evidence-based interpretations', kind: 'text' },
  report: { icon: FileDown, title: 'Download a report', subtitle: 'Export the active analysis as a PDF', kind: 'report' },
}

export default function FeaturePreview({ feature }) {
  const item = previewData[feature]
  const Icon = item.icon
  return (
    <motion.div key={feature} className="feature-preview glass-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}>
      <div className="preview-heading"><span className="icon-badge blue"><Icon /></span><div><strong>{item.title}</strong><span>{item.subtitle}</span></div></div>
      <div className={`preview-art ${item.kind}`}>
        {item.kind === 'upload' && <><div className="upload-cloud"><UploadCloud /></div><span>Drop books.csv here</span></>}
        {item.kind === 'cards' && <div className="mini-card-grid">{[1,2,3,4,5,6].map(i => <i key={i} />)}</div>}
        {item.kind === 'chart' && <div className="mini-bars">{[46,72,38,88,61,78,54].map((h,i) => <i key={i} style={{height:`${h}%`}} />)}</div>}
        {item.kind === 'filters' && <div className="mini-filters"><i /><i /><i /><b>Apply filters</b></div>}
        {item.kind === 'text' && <div className="mini-text"><i /><i /><i className="short" /></div>}
        {item.kind === 'report' && <div className="mini-report"><span>PDF</span><i /><i /><i /></div>}
      </div>
    </motion.div>
  )
}
