import { useEffect, useState } from 'react'
import { StorageKey } from '@/constants/storage'
import { get, set } from '@/lib/storage'

export default function App() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    get<boolean>(StorageKey.SHOW_CONTENT_POPUP).then((value) => {
      setEnabled(value ?? false)
    })
  }, [])

  const toggle = () => {
    const newValue = !enabled
    setEnabled(newValue)
    set(StorageKey.SHOW_CONTENT_POPUP, newValue)
  }

  return (
    <div className="p-4 min-w-50">
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={enabled}
          onChange={toggle}
          className="w-4 h-4"
        />
        <span className="text-sm font-medium">Show floating button on pages</span>
      </label>

      asdasdas
    </div>
  )
}
