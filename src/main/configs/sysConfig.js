import { app } from 'electron'
import is from 'electron-is'
import {
  APP_RUN_MODE,
  APP_THEME,
  EMPTY_STRING,
  ENGINE_MAX_CONNECTION_PER_SERVER
} from '@shared/constants'
import {
  getLogPath
} from '../utils/index'

export default {
  'locale': app.getLocale(),
  'log-path': getLogPath(),
  'dir': app.getPath('downloads'),
  'auto-check-update': is.windows(),
  'auto-hide-window': false,
  'hide-app-menu': is.windows() || is.linux(),
  'keep-window-state': false,
  'last-check-update-time': 0,
  'open-at-login': false,
  'run-mode': APP_RUN_MODE.STANDARD,
  'theme': APP_THEME.AUTO,
  'tray-theme': APP_THEME.AUTO,
  'update-channel': 'latest',
  'window-state': {},
  'allow-menu-expand': true,
  'admin-group': 'admin',
  'default-user-group': 'public',
  'admin-role': 'admin',
  'default-role': 'public'
}
