import { DownloadFailedError } from '@/errors/recording.errors'

const MIME_EXTENSIONS: Record<string, string> = {
  'video/webm': 'webm',
  'video/mp4': 'mp4',
  'audio/webm': 'webm',
  'audio/mp4': 'mp4',
  'audio/ogg': 'ogg',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
}

export class DownloadService {
  private static _instance: DownloadService

  private constructor() {}

  static getInstance(): DownloadService {
    if (!DownloadService._instance) {
      DownloadService._instance = new DownloadService()
    }
    return DownloadService._instance
  }

  async download(blob: Blob, filename: string): Promise<void> {
    if (blob.size === 0) {
      throw new DownloadFailedError('Cannot download an empty blob')
    }

    if (!filename || filename.trim().length === 0) {
      throw new DownloadFailedError('Filename cannot be empty')
    }

    const dataUrl = await this.blobToDataUrl(blob)

    return new Promise<void>((resolve, reject) => {
      chrome.downloads.download(
        { url: dataUrl, filename, saveAs: false },
        () => {
          if (chrome.runtime.lastError) {
            reject(new DownloadFailedError(chrome.runtime.lastError.message))
          } else {
            resolve()
          }
        },
      )
    })
  }

  generateFilename(options?: {
    prefix?: string
    source?: string
    mimeType?: string
    timestamp?: number
  }): string {
    const prefix = options?.prefix ?? 'Recording'
    const source = options?.source ?? 'Screen'
    const date = options?.timestamp !== undefined ? new Date(options.timestamp) : new Date()
    const mimeType = options?.mimeType ?? 'video/webm'
    const extension = MIME_EXTENSIONS[mimeType] ?? 'webm'

    const y = date.getFullYear()
    const M = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const h = String(date.getHours()).padStart(2, '0')
    const m = String(date.getMinutes()).padStart(2, '0')
    const s = String(date.getSeconds()).padStart(2, '0')

    const timestamp = `${y}-${M}-${d}_${h}-${m}-${s}`
    const sanitize = (s: string) => s.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_-]/g, '')
    const safePrefix = sanitize(prefix)
    const safeSource = sanitize(source)

    return `${safePrefix}-${safeSource}-${timestamp}.${extension}`
  }

  private async blobToDataUrl(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return `data:${blob.type};base64,${btoa(binary)}`
  }
}
