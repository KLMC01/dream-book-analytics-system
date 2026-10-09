import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileUp, RotateCcw } from 'lucide-react'
import { useDataset } from '../context/DatasetContext'

export default function DatasetDropzone({ compact = false, onUploaded }) {
  const { uploadDataset, loadSample, loadingDataset, dataset } = useDataset()
  const onDrop = useCallback(async (files) => {
    if (!files?.length) return
    try {
      const data = await uploadDataset(files[0])
      onUploaded?.(data)
    } catch { /* toast handled by context */ }
  }, [uploadDataset, onUploaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'text/csv': ['.csv'],
      'text/tab-separated-values': ['.tsv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
    },
  })

  if (compact) {
    return (
      <div className="compact-upload-wrap">
        <button {...getRootProps()} className="secondary-button compact" disabled={loadingDataset}>
          <input {...getInputProps()} />
          <FileUp size={17} /> {loadingDataset ? 'Loading…' : 'Load Dataset'}
        </button>
      </div>
    )
  }

  return (
    <div className="dataset-loader glass-card">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <div className="drop-icon"><FileUp /></div>
        <div>
          <strong>{isDragActive ? 'Drop your dataset here' : 'Load a new dataset'}</strong>
          <p>Drag and drop, or click to browse. Supports CSV, TSV, XLSX, XLS and JSON up to 25 MB.</p>
        </div>
        <span className="primary-button dropzone-browse">Browse file</span>
      </div>
      <div className="dataset-current">
        <div>
          <span className="eyebrow">Currently analysing</span>
          <strong>{dataset?.filename || 'Loading sample dataset…'}</strong>
        </div>
        {!dataset?.is_sample && (
          <button className="text-button" onClick={loadSample}><RotateCcw size={15} /> Restore sample</button>
        )}
      </div>
    </div>
  )
}
