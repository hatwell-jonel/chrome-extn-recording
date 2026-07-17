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
