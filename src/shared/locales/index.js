/**
 * Welcome to translate to more versions in other languages.
 * Please read the translation guide before starting work.
 * https://github.com/agalwood/Motrix/blob/master/CONTRIBUTING.md#-translation-guide
 *
 * Please keep the locale key in alphabetical order.
 */
export const availableLanguages = [
  {
    value: 'en-US',
    label: 'English'
  },
  {
    value: 'zh-CN',
    label: '简体中文'
  }
]

function checkLngIsAvailable (locale) {
  return availableLanguages.some((lng) => lng.value === locale)
}

/**
 * getLanguage
 * @param { String } locale
 * https://electronjs.org/docs/api/locales
 *
 * Only these locales need to add a `startsWith` fallback
 * when there are with the same prefix
 *
 * de, de-AT, de-CH, de-DE
 * en, en-AU, en-CA, en-GB, en-NZ, en-US, en-ZA
 * es, es-419
 * fr, fr-CA, fr-CH, fr-FR
 * it, it-CH, it-IT
 * pt, pt-BR, pt-PT
 * zh, zh-CN, zh-TW
 */
export function getLanguage (locale = 'en-US') {
  if (checkLngIsAvailable(locale)) {
    return locale
  }

  if (locale.startsWith('en')) {
    return 'en-US'
  }
}
