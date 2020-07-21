<template>
<i :class="`${iconName} ${styleClass}`"/>
</template>

<script>
export default {
  name: 'el-icon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    styleClass: {
      type: String
    }
  },
  computed: {
    iconName() {
      return `el-icon-${this.iconClass}`
    }
  }
}
</script>

<style scoped>

</style>
