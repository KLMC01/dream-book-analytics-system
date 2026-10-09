import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || ''

const DatasetContext = createContext(null)

async function readError(response) {
  try {
    const body = await response.json()
    return body.detail || 'Something went wrong.'
  } catch {
    return 'Something went wrong.'
  }
}

export function DatasetProvider({ children }) {
  const [dataset, setDataset] = useState(null)
  const [loadingDataset, setLoadingDataset] = useState(true)

  const loadSample = useCallback(async () => {
    setLoadingDataset(true)
    try {
      const response = await fetch(`${API_URL}/api/datasets/sample/`)
      if (!response.ok) throw new Error(await readError(response))
      const data = await response.json()
      setDataset(data)
      localStorage.setItem('dream-dataset-id', 'sample')
      return data
    } catch (error) {
      toast.error(error.message)
      return null
    } finally {
      setLoadingDataset(false)
    }
  }, [])

  const restoreDataset = useCallback(async () => {
    const id = localStorage.getItem('dream-dataset-id') || 'sample'
    if (id === 'sample') return loadSample()
    setLoadingDataset(true)
    try {
      const response = await fetch(`${API_URL}/api/datasets/${id}/metadata/`)
      if (!response.ok) return loadSample()
      const data = await response.json()
      setDataset(data)
      return data
    } catch {
      return loadSample()
    } finally {
      setLoadingDataset(false)
    }
  }, [loadSample])

  useEffect(() => { restoreDataset() }, [restoreDataset])

  const uploadDataset = useCallback(async (file) => {
    const body = new FormData()
    body.append('file', file)
    setLoadingDataset(true)
    try {
      const response = await fetch(`${API_URL}/api/datasets/upload/`, { method: 'POST', body })
      if (!response.ok) throw new Error(await readError(response))
      const data = await response.json()
      setDataset(data)
      localStorage.setItem('dream-dataset-id', data.dataset_id)
      toast.success(`${data.filename} loaded successfully`)
      return data
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoadingDataset(false)
    }
  }, [])

  const value = useMemo(() => ({ dataset, loadingDataset, uploadDataset, loadSample }), [dataset, loadingDataset, uploadDataset, loadSample])
  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>
}

export function useDataset() {
  return useContext(DatasetContext)
}
