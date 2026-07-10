import { describe, it, expect } from 'vitest'
import {
  PermissionDeniedError,
  RecordingAlreadyRunningError,
  RecordingNotRunningError,
  CaptureFailedError,
  DownloadFailedError,
} from '../recording.errors'

describe('PermissionDeniedError', () => {
  it('should have the correct name and code', () => {
    const error = new PermissionDeniedError()
    expect(error.name).toBe('PermissionDeniedError')
    expect(error.code).toBe('PERMISSION_DENIED')
  })

  it('should use default message when no detail provided', () => {
    const error = new PermissionDeniedError()
    expect(error.message).toBe('Permission denied')
  })

  it('should use custom detail message', () => {
    const error = new PermissionDeniedError('Camera access denied')
    expect(error.message).toBe('Camera access denied')
  })
})

describe('RecordingAlreadyRunningError', () => {
  it('should have the correct name and code', () => {
    const error = new RecordingAlreadyRunningError()
    expect(error.name).toBe('RecordingAlreadyRunningError')
    expect(error.code).toBe('RECORDING_ALREADY_RUNNING')
  })

  it('should have a fixed message', () => {
    const error = new RecordingAlreadyRunningError()
    expect(error.message).toBe('A recording is already in progress')
  })
})

describe('RecordingNotRunningError', () => {
  it('should have the correct name and code', () => {
    const error = new RecordingNotRunningError()
    expect(error.name).toBe('RecordingNotRunningError')
    expect(error.code).toBe('RECORDING_NOT_RUNNING')
  })

  it('should include the action in the message', () => {
    const error = new RecordingNotRunningError('pause')
    expect(error.message).toBe('Cannot pause: no active recording')
  })

  it('should use default message when no action is given', () => {
    const error = new RecordingNotRunningError()
    expect(error.message).toBe('Cannot perform this action: no active recording')
  })
})

describe('CaptureFailedError', () => {
  it('should have the correct name and code', () => {
    const error = new CaptureFailedError()
    expect(error.name).toBe('CaptureFailedError')
    expect(error.code).toBe('CAPTURE_FAILED')
  })

  it('should use default message when no detail provided', () => {
    const error = new CaptureFailedError()
    expect(error.message).toBe('Failed to capture media')
  })

  it('should use custom detail message', () => {
    const error = new CaptureFailedError('Screen capture aborted')
    expect(error.message).toBe('Screen capture aborted')
  })
})

describe('DownloadFailedError', () => {
  it('should have the correct name and code', () => {
    const error = new DownloadFailedError()
    expect(error.name).toBe('DownloadFailedError')
    expect(error.code).toBe('DOWNLOAD_FAILED')
  })

  it('should use default message when no detail provided', () => {
    const error = new DownloadFailedError()
    expect(error.message).toBe('Failed to download recording')
  })

  it('should use custom detail message', () => {
    const error = new DownloadFailedError('Disk full')
    expect(error.message).toBe('Disk full')
  })

  it('should be an instance of Error', () => {
    const error = new DownloadFailedError()
    expect(error).toBeInstanceOf(Error)
  })
})
