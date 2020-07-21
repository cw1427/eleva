<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <!--<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">-->
        <el-image
          style="width:40px;height:40px"
          :src="avatar">
        </el-image>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            Home
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">LogOut</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import avatar from '@/assets/avatar.jpg'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      avatar,
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  padding-top: 25px;
  height: 45px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
