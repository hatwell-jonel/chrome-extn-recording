import { OffscreenManager } from './offscreen-manager.service'
import { MediaAction } from '@/types/media'
import type { CaptureSource, CaptureOptions } from '@/types/media'
import type { OffscreenMediaResultMessage } from '@/types/messages'

export interface ICaptureEngine {
  startCapture(source: CaptureSource, options?: CaptureOptions): Promise<OffscreenMediaResultMessage>
  stopCapture(): Promise<OffscreenMediaResultMessage>
  pauseCapture(): Promise<OffscreenMediaResultMessage>
  resumeCapture(): Promise<OffscreenMediaResultMessage>
}

export class MediaService implements ICaptureEngine {
  private static _instance: MediaService
  private _offscreenManager: OffscreenManager

  private constructor() {
    this._offscreenManager = OffscreenManager.getInstance()
  }

  static getInstance(): MediaService {
    if (!MediaService._instance) {
      MediaService._instance = new MediaService()
    }
    return MediaService._instance
  }

  async startCapture(source: CaptureSource, options?: CaptureOptions): Promise<OffscreenMediaResultMessage> {
    return this._offscreenManager.sendMediaAction(MediaAction.START_CAPTURE, { source, options })
  }

  async stopCapture(): Promise<OffscreenMediaResultMessage> {
    return this._offscreenManager.sendMediaAction(MediaAction.STOP_CAPTURE)
  }

  async pauseCapture(): Promise<OffscreenMediaResultMessage> {
    return this._offscreenManager.sendMediaAction(MediaAction.PAUSE_CAPTURE)
  }

  async resumeCapture(): Promise<OffscreenMediaResultMessage> {
    return this._offscreenManager.sendMediaAction(MediaAction.RESUME_CAPTURE)
  }
}
