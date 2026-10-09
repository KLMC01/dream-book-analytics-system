import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'


let deferredPrompt = null


export default function InstallButton() {

  const [available, setAvailable] = useState(false)
  const [installed, setInstalled] = useState(false)


  useEffect(() => {


    const handlePrompt = (event) => {

      event.preventDefault()

      deferredPrompt = event

      setAvailable(true)

      console.log(
        "PWA install available"
      )

    }


    const handleInstalled = () => {

      setInstalled(true)

      deferredPrompt = null

    }



    window.addEventListener(
      "beforeinstallprompt",
      handlePrompt
    )


    window.addEventListener(
      "appinstalled",
      handleInstalled
    )



    return () => {

      window.removeEventListener(
        "beforeinstallprompt",
        handlePrompt
      )


      window.removeEventListener(
        "appinstalled",
        handleInstalled
      )

    }


  }, [])



  async function installApp(){


    if(!deferredPrompt){

      alert(
        "Install is not available yet. Open the site normally and try again."
      )

      return

    }



    deferredPrompt.prompt()


    const result =
      await deferredPrompt.userChoice



    console.log(
      "Install result:",
      result.outcome
    )



    deferredPrompt = null

    setAvailable(false)

  }



  return (

    <button

      className="nav-pill"

      onClick={installApp}

      disabled={!available || installed}

      title={
        !available
        ?
        "Install becomes available when supported"
        :
        "Install this app"
      }

    >

      <Download size={16}/>


      <span>

        {
          installed
          ?
          "Installed"
          :
          "Install App"
        }

      </span>


    </button>

  )

}