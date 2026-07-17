export const StorageKey = {
  SETTINGS: 'settings',
  RECORDING_METADATA: 'recording_metadata',
  USER_PREFERENCES: 'user_preferences',
  SHOW_CONTENT_POPUP: 'showContentPopup',
} as const

export type StorageKeyValue = (typeof StorageKey)[keyof typeof StorageKey]
