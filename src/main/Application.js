import { EventEmitter } from 'events'
import { app, shell, dialog, ipcMain } from 'electron'
import is from 'electron-is'
import { readFile } from 'fs'
import { extname, basename } from 'path'
import { isEmpty } from 'lodash'

import logger from './core/Logger'
import ConfigManager from './core/ConfigManager'
import { setupLocaleManager } from '@/ui/Locale'
import Engine from './core/Engine'
import EngineClient from './core/EngineClient'
// import UPnPManager from './core/UPnPManager'
import AutoLaunchManager from './core/AutoLaunchManager'
import UpdateManager from './core/UpdateManager'
import EnergyManager from './core/EnergyManager'
// import ProtocolManager from './core/ProtocolManager'
import WindowManager from './ui/WindowManager'
import MenuManager from './ui/MenuManager'
import TouchBarManager from './ui/TouchBarManager'
import TrayManager from './ui/TrayManager'
import DockManager from './ui/DockManager'
import ThemeManager from './ui/ThemeManager'
import { AUTO_SYNC_TRACKER_INTERVAL, AUTO_CHECK_UPDATE_INTERVAL } from '@shared/constants'
import { checkIsNeedRun } from '@shared/utils'

export default class Application extends EventEmitter {
  constructor () {
    super()
    this.isReady = false
    this.init()
  }

  init () {
    this.configManager = new ConfigManager()
    this.locale = this.configManager.getLocale()
    this.localeManager = setupLocaleManager(this.locale)
    this.i18n = this.localeManager.getI18n()

    this.menuManager = new MenuManager({i18n: this.i18n})
    // this.menuManager.setup(this.locale)
    this.initTouchBarManager()
    this.initWindowManager()

    // this.engine = new Engine({
    //   systemConfig: this.configManager.getSystemConfig(),
    //   userConfig: this.configManager.getUserConfig()
    // })
    // this.startEngine()

    // this.initEngineClient()

    // this.initUPnPManager()

    this.trayManager = new TrayManager({
      theme: this.configManager.getUserConfig('tray-theme'),
      i18n: this.i18n
    })

    this.dockManager = new DockManager({
      runMode: this.configManager.getUserConfig('run-mode')
    })

    this.autoLaunchManager = new AutoLaunchManager()

    this.energyManager = new EnergyManager()

    this.initThemeManager()

    this.initUpdaterManager()

    // this.initProtocolManager()

    this.handleCommands()

    this.handleEvents()

    this.handleIpcMessages()
  }

  initWindowManager () {
    this.windowManager = new WindowManager({
      userConfig: this.configManager.getUserConfig()
    })

    this.windowManager.on('window-resized', (data) => {
      this.storeWindowState(data)
    })
    this.windowManager.on('window-moved', (data) => {
      this.storeWindowState(data)
    })
    this.windowManager.on('window-closed', (data) => {
      this.storeWindowState(data)
    })
  }

  storeWindowState (data = {}) {
    const enabled = this.configManager.getUserConfig('keep-window-state')
    if (!enabled) {
      return
    }

    const state = this.configManager.getUserConfig('window-state', {})
    const { page, bounds } = data
    const newState = {
      ...state,
      [page]: bounds
    }
    this.configManager.setUserConfig('window-state', newState)
  }

  start (page, options = {}) {
    const win = this.showPage(page, options)

    win.once('ready-to-show', () => {
      this.isReady = true
      this.emit('ready')
    })
    if (is.macOS()) {
      this.touchBarManager.setup(page, win)
    }
  }

  showPage (page, options = {}) {
    const { openedAtLogin } = options
    const autoHideWindow = this.configManager.getUserConfig('auto-hide-window')
    return this.windowManager.openWindow(page, {
      hidden: openedAtLogin || autoHideWindow
    })
  }

  show (page = 'index') {
    this.windowManager.showWindow(page)
  }

  hide (page) {
    if (page) {
      this.windowManager.autoHideWindow(page)
    } else {
      this.windowManager.hideAllWindow()
    }
  }

  toggle (page = 'index') {
    this.windowManager.toggleWindow(page)
  }

  closePage (page) {
    this.windowManager.destroyWindow(page)
  }

  async stop () {
    try {
      // await this.shutdownUPnPManager()

      this.energyManager.stopPowerSaveBlocker()

      this.trayManager.destroy()

      await this.stopEngine()
    } catch (err) {
      logger.warn('[Motrix] stop error: ', err.message)
    }
  }

  async quit () {
    await this.stop()
    app.exit()
  }

  sendCommand (command, ...args) {
    if (!this.emit(command, ...args)) {
      const window = this.windowManager.getFocusedWindow()
      if (window) {
        this.windowManager.sendCommandTo(window, command, ...args)
      }
    }
  }

  sendCommandToAll (command, ...args) {
    if (!this.emit(command, ...args)) {
      this.windowManager.getWindowList().forEach(window => {
        this.windowManager.sendCommandTo(window, command, ...args)
      })
    }
  }

  sendMessageToAll (channel, ...args) {
    this.windowManager.getWindowList().forEach(window => {
      this.windowManager.sendMessageTo(window, channel, ...args)
    })
  }

  initThemeManager () {
    this.themeManager = new ThemeManager()
    this.themeManager.on('system-theme-changed', (theme) => {
      this.trayManager.changeIconTheme(theme)
      this.sendCommandToAll('application:system-theme', theme)
    })
  }

  initTouchBarManager () {
    if (!is.macOS()) {
      return
    }
    this.touchBarManager = new TouchBarManager()
  }

  initProtocolManager () {
    if (is.dev() || is.mas()) {
      return
    }
    const protocols = this.configManager.getUserConfig('protocols', {})
    this.protocolManager = new ProtocolManager({
      protocols
    })
  }

  handleFile (filePath) {
    if (!filePath) {
      return
    }

    if (extname(filePath).toLowerCase() !== '.torrent') {
      return
    }

    this.show()

    const fileName = basename(filePath)
    readFile(filePath, (err, data) => {
      if (err) {
        logger.warn(`[Motrix] read file error: ${filePath}`, err.message)
        return
      }
      const file = Buffer.from(data).toString('base64')
      const args = [fileName, file]
      this.sendCommandToAll('application:new-bt-task-with-file', ...args)
    })
  }

  initUpdaterManager () {
    if (is.mas()) {
      return
    }

    const enable = this.configManager.getUserConfig('auto-check-update')
    const lastTime = this.configManager.getUserConfig('last-check-update-time')
    this.updateManager = new UpdateManager({
      autoCheck: checkIsNeedRun(enable, lastTime, AUTO_CHECK_UPDATE_INTERVAL),
      i18n: this.i18n
    })
    this.handleUpdaterEvents()
  }

  handleUpdaterEvents () {
    this.updateManager.on('checking', (event) => {
      this.menuManager.updateMenuItemEnabledState('app.check-for-updates', false)
      this.trayManager.updateMenuItemEnabledState('app.check-for-updates', false)
      this.configManager.setUserConfig('last-check-update-time', Date.now())
    })

    this.updateManager.on('download-progress', (event) => {
      const win = this.windowManager.getWindow('index')
      win.setProgressBar(event.percent / 100)
    })

    this.updateManager.on('update-not-available', (event) => {
      this.menuManager.updateMenuItemEnabledState('app.check-for-updates', true)
      this.trayManager.updateMenuItemEnabledState('app.check-for-updates', true)
    })

    this.updateManager.on('update-downloaded', (event) => {
      this.menuManager.updateMenuItemEnabledState('app.check-for-updates', true)
      this.trayManager.updateMenuItemEnabledState('app.check-for-updates', true)
      const win = this.windowManager.getWindow('index')
      win.setProgressBar(0)
    })

    this.updateManager.on('will-updated', (event) => {
      this.windowManager.setWillQuit(true)
    })

    this.updateManager.on('update-error', (event) => {
      this.menuManager.updateMenuItemEnabledState('app.check-for-updates', true)
      this.trayManager.updateMenuItemEnabledState('app.check-for-updates', true)
    })
  }

  relaunch () {
    this.stop()
    app.relaunch()
    app.exit()
  }

  savePreference (config = {}) {
    logger.info('[Motrix] save preference:', config)
    const { system, user } = config
    if (!isEmpty(system)) {
      console.info('[Motrix] main save system config: ', system)
      this.configManager.setSystemConfig(system)
      this.engineClient.changeGlobalOption(system)
    }

    if (!isEmpty(user)) {
      console.info('[Motrix] main save user config: ', user)
      this.configManager.setUserConfig(user)
    }
  }

  handleCommands () {
    this.on('application:save-preference', this.savePreference)

    this.on('application:relaunch', () => {
      this.relaunch()
    })

    this.on('application:quit', () => {
      this.quit()
    })

    this.on('application:open-at-login', (openAtLogin) => {
      if (is.linux()) {
        return
      }

      if (openAtLogin) {
        this.autoLaunchManager.enable()
      } else {
        this.autoLaunchManager.disable()
      }
    })

    this.on('application:show', (page) => {
      this.show(page)
    })

    this.on('application:hide', (page) => {
      this.hide(page)
    })

    this.on('application:reset', () => {
      this.configManager.reset()
      this.relaunch()
    })

    this.on('application:check-for-updates', () => {
      this.updateManager.check()
    })

    this.on('application:change-theme', (theme) => {
      this.themeManager.updateAppAppearance(theme)
      this.sendCommandToAll('application:theme', theme)
    })

    this.on('application:change-locale', (locale) => {
      this.localeManager.changeLanguageByLocale(locale)
        .then(() => {
          this.menuManager.setup(locale)
          this.trayManager.setup(locale)
        })
    })

    this.on('application:toggle-dock', (visible) => {
      if (visible) {
        this.dockManager.show()
      } else {
        this.dockManager.hide()
        // Hiding the dock icon will trigger the entire app to hide.
        this.show()
      }
    })

    this.on('application:auto-hide-window', (hide) => {
      if (hide) {
        this.windowManager.handleWindowBlur()
      } else {
        this.windowManager.unbindWindowBlur()
      }
    })

    this.on('application:change-menu-states', (visibleStates, enabledStates, checkedStates) => {
      this.menuManager.updateMenuStates(visibleStates, enabledStates, checkedStates)
      this.trayManager.updateMenuStates(visibleStates, enabledStates, checkedStates)
    })

    this.on('application:clear-recent-tasks', () => {
      app.clearRecentDocuments()
    })

  }

  handleEvents () {
    this.on('download-status-change', (downloading) => {
      this.trayManager.updateTrayByStatus(downloading)
      if (downloading) {
        this.energyManager.startPowerSaveBlocker()
      } else {
        this.energyManager.stopPowerSaveBlocker()
      }
    })

    this.on('download-speed-change', (speed) => {
      this.dockManager.setBadge(speed)
    })

    this.on('task-download-complete', (task, path) => {
      this.dockManager.openDock(path)
    })
  }

  handleIpcMessages () {
    ipcMain.on('command', (event, command, ...args) => {
      logger.log('[Motrix] ipc receive command', command, ...args)
      this.emit(command, ...args)
    })

    ipcMain.on('event', (event, eventName, ...args) => {
      logger.log('[Motrix] ipc receive event', eventName, ...args)
      this.emit(eventName, ...args)
    })
  }
}
