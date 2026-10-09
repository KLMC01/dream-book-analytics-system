import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

export default function InstallButton() {
  const [prompt, setPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault()
      setPrompt(event)
    }
    const installedHandler = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', installedHandler)
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  const install = async () => {
    if (!prompt) return
    prompt.prompt()
    await prompt.userChoice
    setPrompt(null)
  }

  return (
    <button className="nav-pill" onClick={install} disabled={!prompt || installed} title={!prompt ? 'Install becomes available when the browser supports PWA installation.' : ''}>
      <Download size={16} />
      <span>{installed ? 'Installed' : 'Install App'}</span>
    </button>
  )
}
