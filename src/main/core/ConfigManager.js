import { app } from 'electron'
import is from 'electron-is'
import Store from 'electron-store'

import {
  getDhtPath,
  getLogPath,
  getSessionPath,
  getUserDownloadsPath,
  getMaxConnectionPerServer
} from '../utils/index'
// import {
//   APP_RUN_MODE,
//   APP_THEME,
//   EMPTY_STRING,
//   ENGINE_MAX_CONNECTION_PER_SERVER,
//   NGOSANG_TRACKERS_BEST_IP_URL,
//   NGOSANG_TRACKERS_BEST_URL,
//   IP_VERSION
// } from '@shared/constants'
import { separateConfig } from '@shared/utils'
import sc from '@/configs/sysConfig.js'
import uc from '@/configs/userConfig.js'

export default class ConfigManager {
  constructor () {
    this.systemConfig = {}
    this.userConfig = {}

    this.init()
  }

  init () {
    this.initSystemConfig()
    this.initUserConfig()
  }

  /**
   * app basic system config
   */
  initSystemConfig () {
    // TODO load sysconfig from json config file.
    this.systemConfig = new Store({
      name: 'system',
      /* eslint-disable quote-props */
      defaults: sc
      /* eslint-enable quote-props */
    })
  }

  initUserConfig () {
    this.userConfig = new Store({
      name: 'user',
      // Schema need electron-store upgrade to 3.x.x,
      // but it will cause the application build to fail.
      // schema: {
      //   theme: {
      //     type: 'string',
      //     enum: ['auto', 'light', 'dark']
      //   }
      // },
      /* eslint-disable quote-props */
      defaults: uc,
      /* eslint-enable quote-props */
    })
    this.fixUserConfig()
  }

  /**
   *  discard function to filter sysConfig according to config key
   */
  fixSystemConfig () {
    const { others } = separateConfig(this.systemConfig.store)
    if (!others) {
      return
    }

    Object.keys(others).forEach(key => {
      this.systemConfig.delete(key)
    })
  }

  fixUserConfig () {
    // Fix the value of open-at-login when the user delete
    // the Motrix self-starting item through startup management.
    const openAtLogin = app.getLoginItemSettings().openAtLogin
    if (this.getUserConfig('open-at-login') !== openAtLogin) {
      this.setUserConfig('open-at-login', openAtLogin)
    }

  }

  getSystemConfig (key, defaultValue) {
    if (typeof key === 'undefined' &&
        typeof defaultValue === 'undefined') {
      return this.systemConfig.store
    }

    return this.systemConfig.get(key, defaultValue)
  }

  getUserConfig (key, defaultValue) {
    if (typeof key === 'undefined' &&
        typeof defaultValue === 'undefined') {
      return this.userConfig.store
    }

    return this.userConfig.get(key, defaultValue)
  }

  getLocale () {
    return this.getUserConfig('locale') || app.getLocale()
  }

  setSystemConfig (...args) {
    this.systemConfig.set(...args)
  }

  setUserConfig (...args) {
    this.userConfig.set(...args)
  }

  reset () {
    this.systemConfig.clear()
    this.userConfig.clear()
  }
}
