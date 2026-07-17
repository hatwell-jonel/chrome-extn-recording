import { PermissionDeniedError } from '@/errors/recording.errors'
import type { RecordingPermissions } from '@/types/recording'

export class PermissionService {
  private static _instance: PermissionService

  private constructor() {}

  static getInstance(): PermissionService {
    if (!PermissionService._instance) {
      PermissionService._instance = new PermissionService()
    }
    return PermissionService._instance
  }

  async check(permission: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      chrome.permissions.contains({ permissions: [permission as chrome.runtime.ManifestPermission] }, (result: boolean) => {
        resolve(result)
      })
    })
  }

  async checkAll(permissions: string[]): Promise<Record<string, boolean>> {
    const entries = await Promise.all(
      permissions.map(async (perm) => [perm, await this.check(perm)] as const),
    )
    return Object.fromEntries(entries)
  }

  async request(permissions: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      chrome.permissions.request({ permissions: permissions as chrome.runtime.ManifestPermission[] }, (granted: boolean) => {
        if (chrome.runtime.lastError) {
          reject(new PermissionDeniedError(chrome.runtime.lastError.message))
        } else if (!granted) {
          reject(new PermissionDeniedError('Permission request was denied'))
        } else {
          resolve()
        }
      })
    })
  }

  async checkRecordingPermissions(): Promise<RecordingPermissions> {
    const [storage, downloads, display] = await Promise.all([
      this.check('storage'),
      this.check('downloads'),
      this.check('desktopCapture'),
    ])
    return {
      camera: null,
      microphone: null,
      display,
      storage,
      downloads,
    }
  }

  async initialize(): Promise<void> {
    const results = await this.checkAll(['storage', 'downloads'])
    if (!results.storage) {
      console.warn('[Permissions] Storage permission not granted')
    }
    if (!results.downloads) {
      console.warn('[Permissions] Downloads permission not granted')
    }
  }
}
