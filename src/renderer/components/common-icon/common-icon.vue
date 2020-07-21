<template>
  <el-icon v-if="iconType=='ElIcon'" :icon-class="iconName" :style-class="styleClass"/>
  <svg-icon v-else :icon-class="iconName"></svg-icon>
</template>

<script>
export default {
  name: 'CommonIcon',
  props: {
    type: {
      type: String,
      required: true
    },
    styleClass: {
      type: String
    }
  },
  computed: {
    iconType () {
      return this.type.indexOf('-') === 0 ? 'ElIcon' : 'SvgIcon'
    },
    iconName () {
      return this.iconType === 'ElIcon' ? this.getCustomIconName(this.type) : this.type
    }
  },
  methods: {
    getCustomIconName (iconName) {
      return iconName.slice(1)
    }
  }
}
</script>

<style>

</style>
