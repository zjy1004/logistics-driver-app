<template>
  <div id="app">
    <layout v-if="showLayout()"/>
    <router-view v-if="!showLayout()"/>
  </div>
</template>

<script>
import Layout from '@/views/Layout'
export default {
  name: 'App',
  components: {
    Layout
  },
  methods: {
    showLayout () {
      return this.$route.name !== 'Login' && this.$route.name !== 'FirstChangePwd'
    }
  }
}
</script>

<style>
body{
  padding: 0;
  margin: 0;
}
#app {
  color: #333;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.van-notify {
  font-size: 50px;
  height: 50px;
  line-height: 50px;
  padding: 0 15px;
}
</style>
