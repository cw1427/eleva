export const EMPTY_STRING = ''

export const APP_THEME = {
  AUTO: 'auto',
  LIGHT: 'light',
  DARK: 'dark'
}

export const APP_RUN_MODE = {
  STANDARD: 1,
  MENU_BAR: 2
}

export const ADD_TASK_TYPE = {
  URI: 'uri',
  TORRENT: 'torrent'
}

export const TASK_STATUS = {
  ACTIVE: 'active',
  WAITING: 'waiting',
  PAUSED: 'paused',
  ERROR: 'error',
  COMPLETE: 'complete',
  REMOVED: 'removed',
  SEEDING: 'seeding'
}

export const ENGINE_RPC_HOST = '127.0.0.1'
export const ENGINE_RPC_PORT = 16800

// 12 Hours
export const AUTO_SYNC_TRACKER_INTERVAL = 12 * 60 * 60 * 1000

// One Week
export const AUTO_CHECK_UPDATE_INTERVAL = 7 * 24 * 60 * 60 * 1000

export const NONE_SELECTED_FILES = 'none'
export const SELECTED_ALL_FILES = 'all'

export const ENGINE_MAX_CONNECTION_PER_SERVER = 4

export const IP_VERSION = {
  V4: 4,
  V6: 6
}
