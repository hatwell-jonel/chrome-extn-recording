import Logo from '@/assets/crx.svg'
import { useEffect, useState } from 'react'
import '../../styles/tailwind.css'

function App() {
  const [enabled, setEnabled] = useState(false)
  const [show, setShow] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    chrome.storage.local.get('showContentPopup', (result: { showContentPopup?: boolean }) => {
      setEnabled(result.showContentPopup ?? false)
      setLoaded(true)
    })

    const handler = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.showContentPopup) {
        setEnabled(changes.showContentPopup.newValue as boolean ?? false)
      }
    }
    chrome.storage.onChanged.addListener(handler)
    return () => chrome.storage.onChanged.removeListener(handler)
  }, [])

  if (!loaded || !enabled) return null

  const toggle = () => setShow(!show)

  return (
    <div className=" border border-red-500 fixed right-0 bottom-0 m-5 z-[100] flex items-end select-none leading-none font-sans">
      {show && (
        <div className={`bg-white text-gray-800 rounded-lg shadow-md w-max h-min px-4 py-2 mr-2 mb-0 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
          <h1>HELLO CRXJS</h1>
        </div>
      )}
      <button
        className="flex justify-center items-center w-10 h-10 rounded-full shadow cursor-pointer border-none bg-[#288cd7] hover:bg-[#1e6aa3]"
        onClick={toggle}
      >
        <img src={Logo} alt="CRXJS logo" className="p-1" />
      </button>
    </div>
  )
}

export default App
