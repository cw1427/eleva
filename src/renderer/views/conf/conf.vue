<template>
  <div class="dashboard-container">
  <el-row>
    <el-col :span="24" style="height:10px"></el-col>
  </el-row>
  <el-row>
    <el-col span="18" offset="2">
        <el-form ref="form" :model="form" label-width="250px" :rules="rules">
              <el-form-item :label="`${$t('preferences.default-dir')}:`"  prop="dir">
                <el-input v-model="form.dir">
                    <mo-select-directory
                        v-if="isRenderer"
                        slot="append"
                        @selected="onDirectorySelected"
                    />
                </el-input>
              </el-form-item>
              <el-form-item
                :label="`${$t('preferences.language')}: `"
                label-width="250px"
                prop="locale"
              >
                <el-col class="form-item-sub" :span="16">
                  <el-select
                    v-model="form.locale"
                    @change="handleLocaleChange"
                    :placeholder="$t('preferences.change-language')">
                    <el-option
                      v-for="item in locales"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSubmit">Save</el-button>
                <el-button  @click="handleCancel">Cancel</el-button>
              </el-form-item>
        </el-form>
    </el-col>
  </el-row>
  </div>

</template>

<script>
import is from 'electron-is'
import { mapGetters } from 'vuex'
import SelectDirectory from '@/components/Native/SelectDirectory'
import { availableLanguages, getLanguage } from '@shared/locales'
import { cloneDeep, isEmpty } from 'lodash'
import { getLocaleManager } from '@/components/Locale'

export default {
  name: 'conf',
  components: {
    [SelectDirectory.name]: SelectDirectory,
  },
  data() {
    const {dir,locale} = this.$store.state.preference.config
    const form = {dir,locale}
    const formOriginal = cloneDeep(form)
    return {
      form,
      formOriginal,
      locales: availableLanguages,
      rules: {
          dir: [
            {required:true, trigger: 'blur'}
          ],
          locale: [
            {required:true, trigger: 'blur'}
          ]
      }
    }
  },
  created: {
  },
  computed: {
    isRenderer () { return is.renderer() },
    isMas () { return is.mas() },
  },
  methods:{
    handleCancel (formName) {
        this.$refs['form'].resetFields()
    },

    onDirectorySelected (dir) {
        this.form.dir = dir
    },

    syncFormConfig () {
        this.$store.dispatch('preference/fetchPreference')
          .then((config) => {
            this.form.dir = config.dir
            this.formOriginal = cloneDeep(this.form)
          })
    },

    handleLocaleChange (locale) {
        const lng = getLanguage(locale)
        getLocaleManager().changeLanguage(lng)
        this.$electron.ipcRenderer.send('command',
                                        'application:change-locale', lng)
    },

    handleSubmit(){
      this.$refs['form'].validate((valid) => {
          if (!valid) {
            this.$message({
                  message: 'valid failed',
                  type: 'error',
            })
            return false
          }
          let data = {}
          if (this.form.dir != this.formOriginal.dir){
             data.dir = this.form.dir
          }
          if (this.form.locale != this.formOriginal.locale){
             data.locale = this.form.locale
          }
          if (!isEmpty(data)){
            this.$store.dispatch('preference/save', data)
            .then(() => {
              this.$store.dispatch('app/fetchEngineOptions')
              this.syncFormConfig()
              this.$msg.success(this.$t('preferences.save-success-message'))
            })
            .catch(() => {
              this.$msg.success(this.$t('preferences.save-fail-message'))
            })
          }else{
            this.$msg.warning('no change')
          }

      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
