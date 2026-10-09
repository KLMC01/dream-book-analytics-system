export default function AnalysisFilters({ analysisType, dataset, filters, setFilters, chartType, setChartType, allowedCharts = [] }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const yearFilters = analysisType !== 'language-distribution' || true
  const showLanguage = ['publication-trends', 'top-authors', 'publisher-analysis', 'missing-isbn'].includes(analysisType)
  const showPublisher = analysisType === 'missing-isbn'
  const showTopN = ['top-authors', 'publisher-analysis'].includes(analysisType)
  const showLanguages = analysisType === 'year-language'

  return (
    <div className="filter-bar glass-card">
      {yearFilters && <>
        <label><span>From year</span><input type="number" value={filters.from_year ?? ''} min={dataset?.min_year || 0} max={dataset?.max_year || 9999} onChange={(e) => update('from_year', e.target.value)} /></label>
        <label><span>To year</span><input type="number" value={filters.to_year ?? ''} min={dataset?.min_year || 0} max={dataset?.max_year || 9999} onChange={(e) => update('to_year', e.target.value)} /></label>
      </>}
      {showLanguage && (
        <label><span>Language</span><select value={filters.language || 'all'} onChange={(e) => update('language', e.target.value)}><option value="all">All languages</option>{dataset?.languages?.map(x => <option key={x} value={x}>{x}</option>)}</select></label>
      )}
      {showPublisher && (
        <label><span>Publisher</span><select value={filters.publisher || 'all'} onChange={(e) => update('publisher', e.target.value)}><option value="all">All publishers</option>{dataset?.publishers?.map(x => <option key={x} value={x}>{x}</option>)}</select></label>
      )}
      {showTopN && <label><span>Top results</span><select value={filters.top_n || (analysisType === 'top-authors' ? 5 : 10)} onChange={(e) => update('top_n', e.target.value)}>{[5,10,15,20,25].map(x => <option key={x} value={x}>Top {x}</option>)}</select></label>}
      {showLanguages && (
        <label className="wide-filter"><span>Languages</span><select multiple value={(filters.languages || '').split(',').filter(Boolean)} onChange={(e) => update('languages', Array.from(e.target.selectedOptions).map(o => o.value).join(','))}>{dataset?.languages?.map(x => <option key={x} value={x}>{x}</option>)}</select><small>Ctrl/Cmd-click to select multiple. Leave empty for the top 5.</small></label>
      )}
      <label><span>Chart type</span><select value={chartType} onChange={(e) => setChartType(e.target.value)}>{allowedCharts.map(type => <option key={type} value={type}>{type === 'horizontalBar' ? 'Horizontal bar' : type[0].toUpperCase() + type.slice(1)}</option>)}</select></label>
    </div>
  )
}
