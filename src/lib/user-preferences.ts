import { StorageKey } from '@/constants/storage'
import { get, set } from './storage'
import type { UserPreferences } from '@/types/storage'

const defaultPreferences: UserPreferences = {
  defaultSource: 'screen',
  includeAudio: true,
  includeMicrophone: false,
  countdownDuration: 3,
  autoDownload: true,
}

export async function getPreferences(): Promise<UserPreferences> {
  const stored = await get<Partial<UserPreferences>>(StorageKey.USER_PREFERENCES)
  return { ...defaultPreferences, ...stored }
}

export async function setPreferences(prefs: Partial<UserPreferences>): Promise<void> {
  const current = await getPreferences()
  await set(StorageKey.USER_PREFERENCES, { ...current, ...prefs })
}
