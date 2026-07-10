export class PermissionDeniedError extends Error {
  public readonly code: string = 'PERMISSION_DENIED'

  constructor(detail?: string) {
    super(detail ?? 'Permission denied')
    this.name = 'PermissionDeniedError'
  }
}

export class RecordingAlreadyRunningError extends Error {
  public readonly code: string = 'RECORDING_ALREADY_RUNNING'

  constructor() {
    super('A recording is already in progress')
    this.name = 'RecordingAlreadyRunningError'
  }
}

export class RecordingNotRunningError extends Error {
  public readonly code: string = 'RECORDING_NOT_RUNNING'

  constructor(action?: string) {
    super(`Cannot ${action ?? 'perform this action'}: no active recording`)
    this.name = 'RecordingNotRunningError'
  }
}

export class CaptureFailedError extends Error {
  public readonly code: string = 'CAPTURE_FAILED'

  constructor(detail?: string) {
    super(detail ?? 'Failed to capture media')
    this.name = 'CaptureFailedError'
  }
}

export class DownloadFailedError extends Error {
  public readonly code: string = 'DOWNLOAD_FAILED'

  constructor(detail?: string) {
    super(detail ?? 'Failed to download recording')
    this.name = 'DownloadFailedError'
  }
}
