import { vi } from 'vitest'

export function createChromeMock() {
  const listeners: Record<string, Array<(...args: unknown[]) => void>> = {}

  const mock = {
    runtime: {
      lastError: null as { message: string } | null,
      sendMessage: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
      onMessage: {
        addListener: vi.fn((cb: (...args: unknown[]) => void) => {
          if (!listeners['onMessage']) listeners['onMessage'] = []
          listeners['onMessage'].push(cb)
        }),
        removeListener: vi.fn((cb: (...args: unknown[]) => void) => {
          if (listeners['onMessage']) {
            listeners['onMessage'] = listeners['onMessage'].filter((l) => l !== cb)
          }
        }),
        trigger: (message: unknown, sender: unknown, sendResponse: (response?: unknown) => void) => {
          if (listeners['onMessage']) {
            for (const listener of listeners['onMessage']) {
              listener(message, sender, sendResponse)
            }
          }
        },
      },
      onInstalled: {
        addListener: vi.fn(),
      },
      onStartup: {
        addListener: vi.fn(),
      },
      id: 'test-extension-id',
      getURL: vi.fn((path: string) => `chrome-extension://test-extension-id/${path}`),
    },
    storage: {
      local: {
        get: vi.fn(),
        set: vi.fn(),
        remove: vi.fn(),
        clear: vi.fn(),
      },
      onChanged: {
        addListener: vi.fn((cb: (...args: unknown[]) => void) => {
          if (!listeners['storageOnChanged']) listeners['storageOnChanged'] = []
          listeners['storageOnChanged'].push(cb)
        }),
        removeListener: vi.fn((cb: (...args: unknown[]) => void) => {
          if (listeners['storageOnChanged']) {
            listeners['storageOnChanged'] = listeners['storageOnChanged'].filter((l) => l !== cb)
          }
        }),
        trigger: (changes: Record<string, { newValue?: unknown; oldValue?: unknown }>) => {
          if (listeners['storageOnChanged']) {
            for (const listener of listeners['storageOnChanged']) {
              listener(changes)
            }
          }
        },
      },
    },
    sidePanel: {
      setOptions: vi.fn(),
      open: vi.fn(),
    },
    tabs: {
      query: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    action: {
      onClicked: {
        addListener: vi.fn(),
      },
      setBadgeText: vi.fn(),
      setBadgeBackgroundColor: vi.fn(),
    },
    downloads: {
      download: vi.fn(
        (
          _options: unknown,
          callback?: (downloadId?: number) => void,
        ) => {
          callback?.(1)
        },
      ),
    },
    permissions: {
      contains: vi.fn(
        (_permissions: { permissions: string[] }, callback: (result: boolean) => void) => {
          callback(true)
        },
      ),
      request: vi.fn(
        (_permissions: { permissions: string[] }, callback: (granted: boolean) => void) => {
          callback(true)
        },
      ),
      getAll: vi.fn((callback: (permissions: { permissions: string[] }) => void) => {
        callback({ permissions: [] })
      }),
      remove: vi.fn(
        (_permissions: { permissions: string[] }, callback: (removed: boolean) => void) => {
          callback(true)
        },
      ),
      onAdded: {
        addListener: vi.fn(),
        removeListener: vi.fn(),
      },
      onRemoved: {
        addListener: vi.fn(),
        removeListener: vi.fn(),
      },
    },
    offscreen: {
      createDocument: vi.fn<(...args: unknown[]) => Promise<void>>().mockResolvedValue(undefined),
      closeDocument: vi.fn<(...args: unknown[]) => Promise<void>>().mockResolvedValue(undefined),
      Reason: {
        USER_MEDIA: 'USER_MEDIA',
        BLOBS: 'BLOBS',
        DOM_SCRAPING: 'DOM_SCRAPING',
        CLIPBOARD: 'CLIPBOARD',
        TESTING: 'TESTING',
      },
    },
  }

  return mock
}
