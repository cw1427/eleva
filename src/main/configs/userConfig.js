import { app } from 'electron'
import is from 'electron-is'
import {
  APP_RUN_MODE,
  APP_THEME,
  EMPTY_STRING,
  ENGINE_MAX_CONNECTION_PER_SERVER
} from '@shared/constants'
import {
  getLogPath,
  getSessionPath,
  getMaxConnectionPerServer
} from '../utils/index'


export default {
  'auto-check-update': is.windows(),
  'auto-hide-window': false,
  'engine-max-connection-per-server': ENGINE_MAX_CONNECTION_PER_SERVER,
  'hide-app-menu': is.windows() || is.linux(),
  'keep-window-state': false,
  'last-check-update-time': 0,
  'locale': app.getLocale(),
  'log-path': getLogPath(),
  'open-at-login': false,
  'run-mode': APP_RUN_MODE.STANDARD,
  'task-notification': true,
  'theme': APP_THEME.AUTO,
  'tray-theme': APP_THEME.AUTO,
  'update-channel': 'latest',
  'window-state': {},
  'allow-menu-expand': true
}
