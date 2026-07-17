import { StorageKey } from '@/constants/storage'
import { get, set } from './storage'
import type { StoredRecording } from '@/types/storage'

export async function getAllRecordings(): Promise<StoredRecording[]> {
  return (await get<StoredRecording[]>(StorageKey.RECORDING_METADATA)) ?? []
}

export async function saveRecording(recording: StoredRecording): Promise<void> {
  const recordings = await getAllRecordings()
  recordings.push(recording)
  await set(StorageKey.RECORDING_METADATA, recordings)
}

export async function deleteRecording(id: string): Promise<void> {
  const recordings = await getAllRecordings()
  await set(
    StorageKey.RECORDING_METADATA,
    recordings.filter((r) => r.id !== id),
  )
}
