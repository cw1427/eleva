import appLocaleEnUS from '@shared/locales/en-US'
import appLocaleZhCN from '@shared/locales/zh-CN'
import appLocaleZhTW from '@shared/locales/zh-TW'

// Please keep the locale key in alphabetical order.
/* eslint-disable quote-props */
const resources = {
  'en-US': {
    translation: {
      ...appLocaleEnUS
    }
  },
  'zh-CN': {
    translation: {
      ...appLocaleZhCN
    }
  }
}
/* eslint-enable quote-props */

export default resources
