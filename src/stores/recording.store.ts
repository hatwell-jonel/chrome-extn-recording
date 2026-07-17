import { create } from 'zustand'
import { sendMessage } from '@/services/messaging.service'
import { MessageType } from '@/constants/messages'
import type { RecordingState, RecordingStatus, RecordingMetadata, RecordingPermissions } from '@/types/recording'
import type { CaptureSource, CaptureOptions } from '@/types/media'
import type { ErrorResponse, ExtensionResponse, RecordingStatusResponse } from '@/types/messages'

interface RecordingStore {
  status: RecordingStatus
  startedAt: number | null
  pausedAt: number | null
  totalPausedDuration: number
  captureSource: CaptureSource | null
  metadata: RecordingMetadata
  error: string | null
  errorCode: string | null
  isLoading: boolean
  isInitialized: boolean
  permissions: RecordingPermissions

  initialize: () => Promise<void>
  startRecording: (source: CaptureSource, options?: CaptureOptions) => Promise<void>
  stopRecording: () => Promise<void>
  pauseRecording: () => Promise<void>
  resumeRecording: () => Promise<void>
  clearError: () => void
}

const initialState: RecordingStore = {
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
  initialize: async () => {},
  startRecording: async () => {},
  stopRecording: async () => {},
  pauseRecording: async () => {},
  resumeRecording: async () => {},
  clearError: () => {},
}

function isStatusResponse(response: ExtensionResponse): response is RecordingStatusResponse {
  return response.type === MessageType.GET_RECORDING_STATUS
}

function isErrorResponse(response: ExtensionResponse): response is ErrorResponse {
  return response.type === 'ERROR'
}

function syncRecordingState(state: RecordingState): Partial<RecordingStore> {
  return {
    status: state.status,
    startedAt: state.startedAt,
    pausedAt: state.pausedAt,
    totalPausedDuration: state.totalPausedDuration,
  }
}

export const useRecordingStore = create<RecordingStore>()((set) => ({
  ...initialState,

  initialize: async () => {
    set({ isLoading: true })
    try {
      const response = await sendMessage({ type: MessageType.GET_RECORDING_STATUS })
      if (isErrorResponse(response)) {
        set({ error: response.message, errorCode: response.code, isLoading: false, isInitialized: true })
        return
      }
      if (isStatusResponse(response)) {
        set({ ...syncRecordingState(response.state), isLoading: false, isInitialized: true })
        return
      }
      set({ isLoading: false, isInitialized: true })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to initialize',
        errorCode: 'INITIALIZE_FAILED',
        isLoading: false,
        isInitialized: true,
      })
    }
  },

  startRecording: async (source, options) => {
    set({ isLoading: true, error: null, errorCode: null, captureSource: source })
    try {
      const response = await sendMessage({ type: MessageType.START_RECORDING, source, options })
      if (isErrorResponse(response)) {
        set({
          status: 'idle',
          startedAt: null,
          pausedAt: null,
          totalPausedDuration: 0,
          captureSource: null,
          error: response.message,
          errorCode: response.code,
          isLoading: false,
        })
        return
      }
      if (isStatusResponse(response)) {
        set({ ...syncRecordingState(response.state), captureSource: source, isLoading: false })
        return
      }
      set({ isLoading: false })
    } catch (err) {
      set({
        status: 'idle',
        startedAt: null,
        pausedAt: null,
        totalPausedDuration: 0,
        captureSource: null,
        error: err instanceof Error ? err.message : 'Failed to start recording',
        errorCode: 'START_RECORDING_FAILED',
        isLoading: false,
      })
    }
  },

  stopRecording: async () => {
    set({ isLoading: true, error: null, errorCode: null })
    try {
      const response = await sendMessage({ type: MessageType.STOP_RECORDING })
      if (isErrorResponse(response)) {
        set({ error: response.message, errorCode: response.code, isLoading: false })
        return
      }
      if (isStatusResponse(response)) {
        set({ ...syncRecordingState(response.state), isLoading: false })
        return
      }
      set({ isLoading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to stop recording',
        errorCode: 'STOP_RECORDING_FAILED',
        isLoading: false,
      })
    }
  },

  pauseRecording: async () => {
    set({ isLoading: true, error: null, errorCode: null })
    try {
      const response = await sendMessage({ type: MessageType.PAUSE_RECORDING })
      if (isErrorResponse(response)) {
        set({ error: response.message, errorCode: response.code, isLoading: false })
        return
      }
      if (isStatusResponse(response)) {
        set({ ...syncRecordingState(response.state), isLoading: false })
        return
      }
      set({ isLoading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to pause recording',
        errorCode: 'PAUSE_RECORDING_FAILED',
        isLoading: false,
      })
    }
  },

  resumeRecording: async () => {
    set({ isLoading: true, error: null, errorCode: null })
    try {
      const response = await sendMessage({ type: MessageType.RESUME_RECORDING })
      if (isErrorResponse(response)) {
        set({ error: response.message, errorCode: response.code, isLoading: false })
        return
      }
      if (isStatusResponse(response)) {
        set({ ...syncRecordingState(response.state), isLoading: false })
        return
      }
      set({ isLoading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to resume recording',
        errorCode: 'RESUME_RECORDING_FAILED',
        isLoading: false,
      })
    }
  },

  clearError: () => {
    set({ error: null, errorCode: null })
  },
}))
