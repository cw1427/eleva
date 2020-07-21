<template>
  <div class="">
  <el-row>
    <el-col :span="24" style="height:50px"></el-col>
  </el-row>
  <el-row>
    <el-col :span="18" :offset="3">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Eleva v{{version}}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="checkUpdate">Check for update</el-button>
          </div>
          <label>Release note:</label>
          <ul>
            <li>v0.1.0: Eleva init.</li>
          </ul>

        </el-card>
    </el-col>
  </el-row>
  </div>
</template>

<script>
import is from 'electron-is'
import { mapGetters } from 'vuex'
import { isEmpty } from 'lodash'

const { version } = require('@/../../package.json')

export default {
  name: 'conf',
  components: {

  },
  data() {
    return {
      version: `${version}`
    }
  },
  computed: {
    isRenderer () { return is.renderer() },
    isMas () { return is.mas() },
  },
  methods:{
    handleCancel (formName) {

     },

    checkUpdate(){
       this.$message.success('Start checking...')
       this.$electron.ipcRenderer.send('command', 'application:check-for-updates')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
