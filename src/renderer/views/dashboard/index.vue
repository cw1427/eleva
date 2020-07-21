<template>
  <div class="dashboard-container">
     <component :is="currentRole" />
  </div>
</template>

<script>
import is from 'electron-is'
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import { isEmpty } from 'lodash'

const url = require('url')

export default {
  name: 'Dashboard',
  components: {
     adminDashboard, editorDashboard
  },
  data() {
    return {
        currentRole: 'adminDashboard'
    }
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  },
  computed: {
    isRenderer () { return is.renderer() },
    isMas () { return is.mas() },
    ...mapGetters([
      'name',
      'roles'
    ]),
  },
  methods:{
    handleCancel (formName) {

     },

    onSubmit (formName) {

    },

    onDirectorySelected (dir) {
        this.form.dir = dir
    },

    onCancel (dir) {

    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
