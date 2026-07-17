import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRecordingStore } from '../recording.store'
import { MessageType } from '@/constants/messages'
import { type ChromeMock } from '@/test/mocks/chrome'
import type { RecordingStatusResponse, ExtensionResponse } from '@/types/messages'
import type { RecordingState } from '@/types/recording'

const idleState: RecordingState = {
  status: 'idle',
  startedAt: null,
  pausedAt: null,
  totalPausedDuration: 0,
}

const recordingState: RecordingState = {
  status: 'recording',
  startedAt: 5000,
  pausedAt: null,
  totalPausedDuration: 0,
}

const pausedState: RecordingState = {
  status: 'paused',
  startedAt: 5000,
  pausedAt: 8000,
  totalPausedDuration: 1000,
}

function mockStatusResponse(state: RecordingState): RecordingStatusResponse {
  return { type: MessageType.GET_RECORDING_STATUS, state }
}

function mockErrorResponse(code: string, message: string): ExtensionResponse & { type: 'ERROR' } {
  return { type: 'ERROR', code, message, handler: 'background' }
}

describe('RecordingStore', () => {
  let mockChrome: ChromeMock

  beforeEach(() => {
    mockChrome = chrome as unknown as ChromeMock
    vi.clearAllMocks()

    useRecordingStore.setState({
      status: 'idle',
      startedAt: null,
      pausedAt: null,
      totalPausedDuration: 0,
      captureSource: null,
      metadata: {},
      error: null,
      errorCode: null,
      isLoading: false,
      isInitialized: false,
      permissions: {
        camera: null,
        microphone: null,
        display: null,
        storage: null,
        downloads: null,
      },
    })
  })

  describe('initialize', () => {
    it('should fetch status from background and update state', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockStatusResponse(recordingState))

      await useRecordingStore.getState().initialize()

      const state = useRecordingStore.getState()
      expect(state.status).toBe('recording')
      expect(state.startedAt).toBe(5000)
      expect(state.isInitialized).toBe(true)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should handle idle status response', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockStatusResponse(idleState))

      await useRecordingStore.getState().initialize()

      const state = useRecordingStore.getState()
      expect(state.status).toBe('idle')
      expect(state.startedAt).toBeNull()
      expect(state.isInitialized).toBe(true)
    })

    it('should set error on error response from background', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockErrorResponse('UNKNOWN', 'Something went wrong'))

      await useRecordingStore.getState().initialize()

      const state = useRecordingStore.getState()
      expect(state.error).toBe('Something went wrong')
      expect(state.errorCode).toBe('UNKNOWN')
      expect(state.isInitialized).toBe(true)
      expect(state.isLoading).toBe(false)
    })

    it('should handle network errors', async () => {
      mockChrome.runtime.sendMessage.mockRejectedValue(new Error('Connection failed'))

      await useRecordingStore.getState().initialize()

      const state = useRecordingStore.getState()
      expect(state.error).toBe('Connection failed')
      expect(state.errorCode).toBe('INITIALIZE_FAILED')
      expect(state.isInitialized).toBe(true)
    })

    it('should send GET_RECORDING_STATUS message', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockStatusResponse(idleState))

      await useRecordingStore.getState().initialize()

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: MessageType.GET_RECORDING_STATUS,
      })
    })
  })

  describe('startRecording', () => {
    it('should send START_RECORDING with source and update state on success', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockStatusResponse(recordingState))

      await useRecordingStore.getState().startRecording('screen')

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: MessageType.START_RECORDING,
        source: 'screen',
        options: undefined,
      })

      const state = useRecordingStore.getState()
      expect(state.status).toBe('recording')
      expect(state.captureSource).toBe('screen')
      expect(state.isLoading).toBe(false)
    })

    it('should pass capture options', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockStatusResponse(recordingState))

      await useRecordingStore.getState().startRecording('tab', { audio: true, video: false })

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: MessageType.START_RECORDING,
        source: 'tab',
        options: { audio: true, video: false },
      })
    })

    it('should rollback to idle on error response', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockErrorResponse('RECORDING_ALREADY_RUNNING', 'A recording is already in progress'))

      await useRecordingStore.getState().startRecording('screen')

      const state = useRecordingStore.getState()
      expect(state.status).toBe('idle')
      expect(state.captureSource).toBeNull()
      expect(state.error).toBe('A recording is already in progress')
      expect(state.errorCode).toBe('RECORDING_ALREADY_RUNNING')
      expect(state.isLoading).toBe(false)
    })

    it('should rollback on network error', async () => {
      mockChrome.runtime.sendMessage.mockRejectedValue(new Error('Connection lost'))

      await useRecordingStore.getState().startRecording('window')

      const state = useRecordingStore.getState()
      expect(state.status).toBe('idle')
      expect(state.captureSource).toBeNull()
      expect(state.error).toBe('Connection lost')
      expect(state.errorCode).toBe('START_RECORDING_FAILED')
    })

    it('should set capture source optimistically before background response', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockStatusResponse(recordingState))

      const storePromise = useRecordingStore.getState().startRecording('screen')

      expect(useRecordingStore.getState().captureSource).toBe('screen')
      expect(useRecordingStore.getState().isLoading).toBe(true)

      await storePromise
    })

    it('should work with all capture sources', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockStatusResponse(recordingState))

      const sources: Array<'screen' | 'window' | 'tab'> = ['screen', 'window', 'tab']
      for (const source of sources) {
        useRecordingStore.setState({
          status: 'idle',
          startedAt: null,
          pausedAt: null,
          totalPausedDuration: 0,
          captureSource: null,
          error: null,
          errorCode: null,
        })

        await useRecordingStore.getState().startRecording(source)

        const state = useRecordingStore.getState()
        expect(state.captureSource).toBe(source)
        expect(state.status).toBe('recording')
      }
    })
  })

  describe('stopRecording', () => {
    it('should send STOP_RECORDING and update state to idle', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockStatusResponse(idleState))

      await useRecordingStore.getState().stopRecording()

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: MessageType.STOP_RECORDING,
      })

      const state = useRecordingStore.getState()
      expect(state.status).toBe('idle')
      expect(state.isLoading).toBe(false)
    })

    it('should set error on failure', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockErrorResponse('STOP_FAILED', 'Cannot stop: no active recording'))

      await useRecordingStore.getState().stopRecording()

      const state = useRecordingStore.getState()
      expect(state.error).toBe('Cannot stop: no active recording')
      expect(state.errorCode).toBe('STOP_FAILED')
    })
  })

  describe('pauseRecording', () => {
    it('should send PAUSE_RECORDING and update state', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockStatusResponse(pausedState))

      await useRecordingStore.getState().pauseRecording()

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: MessageType.PAUSE_RECORDING,
      })

      const state = useRecordingStore.getState()
      expect(state.status).toBe('paused')
      expect(state.pausedAt).toBe(8000)
      expect(state.isLoading).toBe(false)
    })

    it('should set error on failure', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockErrorResponse('PAUSE_FAILED', 'Cannot pause: no active recording'))

      await useRecordingStore.getState().pauseRecording()

      expect(useRecordingStore.getState().error).toBe('Cannot pause: no active recording')
    })
  })

  describe('resumeRecording', () => {
    it('should send RESUME_RECORDING and update state', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockStatusResponse({
        status: 'recording',
        startedAt: 5000,
        pausedAt: null,
        totalPausedDuration: 2000,
      }))

      await useRecordingStore.getState().resumeRecording()

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: MessageType.RESUME_RECORDING,
      })

      const state = useRecordingStore.getState()
      expect(state.status).toBe('recording')
      expect(state.pausedAt).toBeNull()
      expect(state.totalPausedDuration).toBe(2000)
      expect(state.isLoading).toBe(false)
    })

    it('should set error on failure', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue(mockErrorResponse('RESUME_FAILED', 'Cannot resume: no active recording'))

      await useRecordingStore.getState().resumeRecording()

      expect(useRecordingStore.getState().error).toBe('Cannot resume: no active recording')
    })
  })

  describe('clearError', () => {
    it('should reset error and errorCode to null', () => {
      useRecordingStore.setState({ error: 'Some error', errorCode: 'SOME_ERROR' })

      useRecordingStore.getState().clearError()

      const state = useRecordingStore.getState()
      expect(state.error).toBeNull()
      expect(state.errorCode).toBeNull()
    })

    it('should not affect other state', () => {
      useRecordingStore.setState({
        status: 'recording',
        startedAt: 1000,
        captureSource: 'screen',
        error: 'Some error',
        errorCode: 'SOME_ERROR',
      })

      useRecordingStore.getState().clearError()

      const state = useRecordingStore.getState()
      expect(state.error).toBeNull()
      expect(state.errorCode).toBeNull()
      expect(state.status).toBe('recording')
      expect(state.startedAt).toBe(1000)
      expect(state.captureSource).toBe('screen')
    })
  })
})
