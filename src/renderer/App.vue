<template>
  <div id="app">
    <mo-title-bar
      v-if="isRenderer"
      :showActions="showWindowActions"
    />
    <router-view></router-view>

    <mo-ipc v-if="isRenderer" />
  </div>
</template>

<script>
  import is from 'electron-is'
  import { mapState } from 'vuex'
  import { APP_THEME } from '@shared/constants'
  import TitleBar from '@/components/Native/TitleBar'
  import Ipc from '@/components/Native/Ipc'

  export default {
    name: 'App',
    components: {
      [TitleBar.name]: TitleBar,
      [Ipc.name]: Ipc
    },
    computed: {
      isRenderer () { return is.renderer() },
      ...mapState('app', {
        systemTheme: state => state.systemTheme
      }),
      ...mapState('preference', {
        showWindowActions: state => {
          // return (is.windows() || is.linux()) && true
          return (is.windows() || is.linux()) && state.config.hideAppMenu
        },
        rpcSecret: state => state.config.rpcSecret,
        theme: state => state.config.theme,
        locale: state => state.config.locale,
        dir: state => getLangDirection(state.config.locale)
      }),
      themeClass: function () {
        if (this.theme === APP_THEME.AUTO) {
          return `theme-${this.systemTheme}`
        } else {
          return `theme-${this.theme}`
        }
      },
      i18nClass: function () {
        return `i18n-${this.locale}`
      },
      dirClass: function () {
        return `dir-${this.dir}`
      }
    },
  }
</script>

<style>
  /* CSS */
</style>
