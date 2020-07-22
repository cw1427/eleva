import { Message } from 'element-ui'
import { base64StringToBlob } from 'blob-util'

import router from '@/router'
import store from '@/store'
import { buildFileList } from '@shared/utils'
import { ADD_TASK_TYPE } from '@shared/constants'
import { getLocaleManager } from '@/components/Locale'
import CommandManager from './CommandManager'

const commands = new CommandManager()
const i18n = getLocaleManager().getI18n()

function updateSystemTheme (theme) {
  store.dispatch('app/updateSystemTheme', theme)
}

function updateTheme (theme) {
  store.dispatch('preference/changeThemeConfig', theme)
}


function navigateTaskList (status = 'active') {
  router.push({ path: `/task/${status}` }).catch(err => {
    console.log(err)
  })
}

function navigatePreferences () {
  router.push({ path: '/preference' }).catch(err => {
    console.log(err)
  })
}

function showUnderDevelopmentMessage () {
  Message.info(i18n.t('app.under-development-message'))
}

commands.register('application:system-theme', updateSystemTheme)
commands.register('application:theme', updateTheme)
commands.register('application:task-list', navigateTaskList)
commands.register('application:preferences', navigatePreferences)


export {
  commands
}
