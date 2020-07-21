<template>
  <div class="dashboard-container">
    <el-form ref="downloadForm" :model="form" :rules="rules" label-width="180px">
      <el-form-item label="Artifactory Link"  prop="link">
        <el-input type="textarea" v-model="form.link" :autosize="{ minRows: 3, maxRows: 5 }" auto-complete="off"></el-input>
        <label style="word-break:break-all">Eg: fit_test/sofiar/10/QPE30.79-99/sofiar_reteu/userdebug/intcfg_test-keys/fastboot_sofiar_reteu_userdebug_10_QPE30.79-99_03a43_intcfg_test-keys_retail_US.tar.gz</label>
      </el-form-item>
      <el-form-item label="Show guidance">
          <el-link type="success" :underline="false" href="" target="_blank">Artifactory</el-link>
          <el-button type="success" icon="el-icon-edit" plain @click="dialogVisible=true">Tips</el-button>
      </el-form-item>
      <el-form-item label="Save path"  prop="dir">
        <el-input
          placeholder=""
          v-model="form.dir"
          :readonly="isMas"
        >
          <mo-select-directory
            v-if="isRenderer"
            slot="append"
            @selected="onDirectorySelected"
          />
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('downloadForm')" plain>Download</el-button>
        <el-button @click="onCancel('downloadForm')">Cancel</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="Click image to close tips window"
      :visible.sync="dialogVisible"
      fullscreen=true
      :show-close="false"
      :before-close="handleClose">
        <el-image
          style="width: 100%; height: 100%"
          :src="imgurl"
          @click="dialogVisible = false">
        </el-image>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import is from 'electron-is'
import { mapGetters } from 'vuex'
import SelectDirectory from '@/components/Native/SelectDirectory'
import { isEmpty } from 'lodash'
import sampleImg from '@/assets/eleva_sample.jpg'

const url = require('url')

export default {
  name: 'Dashboard',
  components: {
      [SelectDirectory.name]: SelectDirectory,
  },
  data() {
    return {
      dialogVisible: false,
      imgurl:  sampleImg,
      form: {
        link: '',
        thread: 4,
        dir: this.$store.state.preference.config.dir
      },
      rules: {
          link: [
            { required: true, trigger: 'blur' },
          ],
          dir: [
            {required:true, trigger: 'blur'}
          ]
      }
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
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false
          }
          try {
              let payload = null
              payload = this.buildUriPayload(this.form)
              this.$store.dispatch('task/addUri', payload).catch(err => {
                this.$msg.error(err.message)
              })
              // switch to task page
              this.$router.push({
                path: '/task/active'
              }).catch(err => {
                console.log(err)
              })
          } catch (err) {
            this.$msg.error(err.message)
          }
        })
    },

    onDirectorySelected (dir) {
        this.form.dir = dir
    },

    onCancel (dir) {
        this.form.link = ''
        this.form.dir = ''
        this.form.thread = 4
        this.$refs['downloadForm'].resetFields()
    },

    /**
     *  adust download link to add authentication info.
     *  TODO
     */
    buildUriPayload (form) {
        let { link, dir, thread } = form
        if (isEmpty(link)) {
          throw new Error(this.$t('task.new-task-uris-required'))
        }
        // link = https://<user>:<password>@link
        link = this.genLink(link.trim())
        const uris=[link]
        const outs=null
        const options=this.buildOption(form)
        const result = {
          uris,
          outs,
          options
        }
        return result
    },

    buildOption (form) {
        const { dir, out, thread } = form
        const result = {}

        if (!isEmpty(dir)) {
          result.dir = dir
        }

        if (!isEmpty(out)) {
          result.out = out
        }

        //----add httpUser  httpPassword option
        result.header = 'X-JFrog-Art-Api:' + this.$store.getters.token
        result.maxConnectionPerServer = thread
        return result
      },

      genLink(link){
          return url.resolve(process.env.BASE_API, 'artifactory/' + link)
      }
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
