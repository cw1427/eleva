<template>
  <div v-if="false"></div>
</template>

<script>
  import is from 'electron-is'
  import { mapState } from 'vuex'
  import {
    commands
  } from '@/components/Command/index.js'

  export default {
    name: 'mo-ipc',
    computed: {

    },
    watch: {
    },
    methods: {
      bindIpcEvents: function () {
        this.$electron.ipcRenderer.on('command', (event, command, ...args) => {
          commands.execute(command, ...args)
        })
      },
      unbindIpcEvents: function () {
        this.$electron.ipcRenderer.removeAllListeners('command')
      }
    },
    created: function () {
      this.bindIpcEvents()
      // id of the menu item
      const visibleStates = {}
      if (is.mas()) {
        visibleStates['app.check-for-updates'] = false
      }
      this.$electron.ipcRenderer.send('command', 'application:change-menu-states', visibleStates, null, null)
    },
    destroyed: function () {
      this.unbindIpcEvents()
    }
  }
</script>
