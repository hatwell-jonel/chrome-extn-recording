import { vi } from 'vitest'

export function createChromeMock() {
  const listeners: Record<string, Array<(...args: unknown[]) => void>> = {}

  const mock = {
    runtime: {
      sendMessage: vi.fn(),
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
        addListener: vi.fn(),
        removeListener: vi.fn(),
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
  }

  return mock
}
