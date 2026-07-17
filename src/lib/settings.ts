import { StorageKey } from '@/constants/storage'
import { get, set } from './storage'
import type { Settings } from '@/types/storage'

const defaultSettings: Settings = {
  showContentPopup: false,
}

export async function getSettings(): Promise<Settings> {
  const stored = await get<Partial<Settings>>(StorageKey.SETTINGS)
  return { ...defaultSettings, ...stored }
}

export async function setSettings(settings: Partial<Settings>): Promise<void> {
  const current = await getSettings()
  await set(StorageKey.SETTINGS, { ...current, ...settings })
}
