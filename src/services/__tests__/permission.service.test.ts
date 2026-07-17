import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PermissionService } from '../permission.service'
import { PermissionDeniedError } from '@/errors/recording.errors'
import { createChromeMock } from '@/test/mocks/chrome'

type ChromeMock = ReturnType<typeof createChromeMock>

describe('PermissionService', () => {
  let service: PermissionService
  let mockChrome: ChromeMock

  beforeEach(() => {
    PermissionService['_instance'] = undefined as unknown as PermissionService
    service = PermissionService.getInstance()
    mockChrome = chrome as unknown as ChromeMock
    mockChrome.runtime.lastError = null
    vi.clearAllMocks()
    mockChrome.permissions.contains.mockImplementation(
      (_permissions: { permissions: string[] }, callback: (result: boolean) => void) => {
        callback(true)
      },
    )
    mockChrome.permissions.request.mockImplementation(
      (_permissions: { permissions: string[] }, callback: (granted: boolean) => void) => {
        callback(true)
      },
    )
  })

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = PermissionService.getInstance()
      const instance2 = PermissionService.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('check', () => {
    it('should return true when permission is granted', async () => {
      const result = await service.check('storage')
      expect(result).toBe(true)
    })

    it('should return false when permission is denied', async () => {
      mockChrome.permissions.contains.mockImplementation(
        (_permissions: { permissions: string[] }, callback: (result: boolean) => void) => {
          callback(false)
        },
      )

      const result = await service.check('storage')
      expect(result).toBe(false)
    })

    it('should call chrome.permissions.contains with the correct permission', async () => {
      await service.check('downloads')
      expect(mockChrome.permissions.contains).toHaveBeenCalledWith(
        { permissions: ['downloads'] },
        expect.any(Function),
      )
    })
  })

  describe('checkAll', () => {
    it('should return a map of permission results', async () => {
      mockChrome.permissions.contains
        .mockImplementationOnce(
          (_perms: { permissions: string[] }, cb: (r: boolean) => void) => cb(true),
        )
        .mockImplementationOnce(
          (_perms: { permissions: string[] }, cb: (r: boolean) => void) => cb(false),
        )

      const result = await service.checkAll(['storage', 'downloads'])
      expect(result).toEqual({ storage: true, downloads: false })
    })

    it('should return empty object for empty array', async () => {
      const result = await service.checkAll([])
      expect(result).toEqual({})
    })
  })

  describe('request', () => {
    it('should resolve when permission is granted', async () => {
      await expect(service.request(['storage'])).resolves.toBeUndefined()
    })

    it('should throw PermissionDeniedError when permission is denied', async () => {
      mockChrome.permissions.request.mockImplementation(
        (_permissions: { permissions: string[] }, callback: (granted: boolean) => void) => {
          callback(false)
        },
      )

      await expect(service.request(['storage'])).rejects.toThrow(PermissionDeniedError)
      await expect(service.request(['storage'])).rejects.toThrow('Permission request was denied')
    })

    it('should throw PermissionDeniedError on chrome runtime error', async () => {
      mockChrome.permissions.request.mockImplementation(
        (_permissions: { permissions: string[] }, callback: (granted: boolean) => void) => {
          mockChrome.runtime.lastError = { message: 'Invalid permission' }
          callback(false)
        },
      )

      await expect(service.request(['invalid'])).rejects.toThrow(PermissionDeniedError)
      await expect(service.request(['invalid'])).rejects.toThrow('Invalid permission')
    })

    it('should call chrome.permissions.request with the given permissions', async () => {
      await service.request(['storage', 'downloads'])
      expect(mockChrome.permissions.request).toHaveBeenCalledWith(
        { permissions: ['storage', 'downloads'] },
        expect.any(Function),
      )
    })
  })

  describe('checkRecordingPermissions', () => {
    it('should return RecordingPermissions object', async () => {
      mockChrome.permissions.contains
        .mockImplementationOnce((_p: { permissions: string[] }, cb: (r: boolean) => void) => cb(true))
        .mockImplementationOnce((_p: { permissions: string[] }, cb: (r: boolean) => void) => cb(true))
        .mockImplementationOnce((_p: { permissions: string[] }, cb: (r: boolean) => void) => cb(false))

      const result = await service.checkRecordingPermissions()

      expect(result).toEqual({
        camera: null,
        microphone: null,
        display: false,
        storage: true,
        downloads: true,
      })
    })

    it('should check storage, downloads, and desktopCapture permissions', async () => {
      await service.checkRecordingPermissions()

      expect(mockChrome.permissions.contains).toHaveBeenCalledWith(
        { permissions: ['storage'] },
        expect.any(Function),
      )
      expect(mockChrome.permissions.contains).toHaveBeenCalledWith(
        { permissions: ['downloads'] },
        expect.any(Function),
      )
      expect(mockChrome.permissions.contains).toHaveBeenCalledWith(
        { permissions: ['desktopCapture'] },
        expect.any(Function),
      )
    })
  })

  describe('initialize', () => {
    it('should check storage and downloads permissions', async () => {
      await service.initialize()

      expect(mockChrome.permissions.contains).toHaveBeenCalledWith(
        { permissions: ['storage'] },
        expect.any(Function),
      )
      expect(mockChrome.permissions.contains).toHaveBeenCalledWith(
        { permissions: ['downloads'] },
        expect.any(Function),
      )
    })

    it('should not throw when permissions are granted', async () => {
      await expect(service.initialize()).resolves.toBeUndefined()
    })

    it('should warn when permissions are missing', async () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mockChrome.permissions.contains
        .mockImplementationOnce((_p: { permissions: string[] }, cb: (r: boolean) => void) => cb(false))
        .mockImplementationOnce((_p: { permissions: string[] }, cb: (r: boolean) => void) => cb(false))

      await service.initialize()

      expect(consoleWarn).toHaveBeenCalledTimes(2)
      expect(consoleWarn).toHaveBeenCalledWith('[Permissions] Storage permission not granted')
      expect(consoleWarn).toHaveBeenCalledWith('[Permissions] Downloads permission not granted')

      consoleWarn.mockRestore()
    })
  })
})
