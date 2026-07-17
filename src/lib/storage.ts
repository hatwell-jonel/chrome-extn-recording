export async function get<T>(key: string): Promise<T | undefined> {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key] as T | undefined)
    })
  })
}

export async function set(key: string, value: unknown): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve()
    })
  })
}

export async function remove(key: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove(key, () => {
      resolve()
    })
  })
}

export function onChanged<T>(
  key: string,
  callback: (value: T | undefined) => void,
): () => void {
  const handler = (changes: Record<string, chrome.storage.StorageChange>) => {
    if (changes[key]) {
      callback(changes[key].newValue as T | undefined)
    }
  }

  chrome.storage.onChanged.addListener(handler)
  return () => chrome.storage.onChanged.removeListener(handler)
}
