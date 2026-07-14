import { MessageType } from '@/constants/messages'
import type { MediaActionValue } from '@/types/media'
import type {
  ExtensionResponse,
  OffscreenMediaActionMessage,
  OffscreenMediaResultMessage,
} from '@/types/messages'

const OFFSCREEN_DOCUMENT_URL = 'src/offscreen/index.html'

export class OffscreenManager {
  private static _instance: OffscreenManager
  private _isCreated = false

  private constructor() {}

  static getInstance(): OffscreenManager {
    if (!OffscreenManager._instance) {
      OffscreenManager._instance = new OffscreenManager()
    }
    return OffscreenManager._instance
  }

  get isCreated(): boolean {
    return this._isCreated
  }

  async create(): Promise<void> {
    if (this._isCreated) return

    await chrome.offscreen.createDocument({
      url: chrome.runtime.getURL(OFFSCREEN_DOCUMENT_URL),
      reasons: [chrome.offscreen.Reason.USER_MEDIA],
      justification: 'Recording requires access to media APIs not available in the service worker.',
    })

    this._isCreated = true
  }

  async close(): Promise<void> {
    if (!this._isCreated) return

    await chrome.offscreen.closeDocument()
    this._isCreated = false
  }

  async sendMediaAction(
    action: MediaActionValue,
    payload?: unknown,
  ): Promise<OffscreenMediaResultMessage> {
    const message: OffscreenMediaActionMessage = {
      type: MessageType.OFFSCREEN_MEDIA_ACTION,
      action,
      payload,
    }

    const response = await chrome.runtime.sendMessage(message) as ExtensionResponse

    if (response.type === 'ERROR') {
      throw new Error(`Offscreen media action failed: ${response.message}`)
    }

    return response as OffscreenMediaResultMessage
  }

  async ping(): Promise<boolean> {
    try {
      const response = await chrome.runtime.sendMessage({ type: MessageType.PING })
      return (response as ExtensionResponse).type === MessageType.PONG
    } catch {
      return false
    }
  }
}
