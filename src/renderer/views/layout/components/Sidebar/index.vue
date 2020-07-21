<template>
  <scroll-bar>
    <div class="logo-con">
        <el-image
          style="height:75px"
          :src="logo">
        </el-image>
    </div>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import minLogo from '@/assets/logo_50x70.jpg'
import maxLogo from '@/assets/logo.jpg'

export default {
  components: { SidebarItem, ScrollBar },
  data() {
    return {
      minLogo,
      maxLogo
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    logo() {
       return this.sidebar.opened ? maxLogo : minLogo
    }
  }
}
</script>
<style scope='local'>

.logo-con{
  height:70px;
  background-color:#304156
}

</style>
