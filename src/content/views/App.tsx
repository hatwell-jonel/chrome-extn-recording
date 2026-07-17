import Logo from '@/assets/crx.svg'
import { useEffect, useState } from 'react'
import { StorageKey } from '@/constants/storage'
import { get, onChanged } from '@/lib/storage'
import '../../styles/tailwind.css'

function App() {
  const [enabled, setEnabled] = useState(false)
  const [show, setShow] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    get<boolean>(StorageKey.SHOW_CONTENT_POPUP).then((value) => {
      setEnabled(value ?? false)
      setLoaded(true)
    })

    const unsub = onChanged<boolean>(StorageKey.SHOW_CONTENT_POPUP, (value) => {
      setEnabled(value ?? false)
    })
    return () => unsub()
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
