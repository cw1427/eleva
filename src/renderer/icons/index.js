import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg
import ElIcon from '@/components/el-icon'// el-icon
import CommonIcon from '@/components/common-icon'// common-icon to wrap both icons

// register globally
Vue.component('SvgIcon', SvgIcon)
Vue.component('el-icon', ElIcon)
Vue.component('common-icon', CommonIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
