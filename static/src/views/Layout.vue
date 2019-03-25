<template>
  <div class="lay-con">
    <!-- <v-header/> -->
    <div class="main-con">
      <!-- <router-view/> -->
    </div>
    <my-center
      :show-center="showSetting"
      ref="myCenter"
    />
  </div>
</template>

<script>
import VHeader from '@/components/Header/Header'
import MyCenter from '@/views/MyCenter/MyCenter'
export default {
  name: 'Layout',
  data () {
    return {
      showSetting: false
    }
  },
  components: {
    VHeader,
    MyCenter
  },
  created () {},
  mounted () {
    let modalDrawer = document.getElementsByClassName('vux-drawer-body')[0]
    modalDrawer.addEventListener('click', this.clickModalDrawer, true)
  },
  methods: {
    clickModalDrawer (e) {
      this.showSetting = false
    }
  }
}
</script>

<style lang="less">
.lay-con{
  .vux-drawer{
    -z-index: 2;
  }
}
</style>

<style lang="less" scoped>
.lay-con{
  // overflow-y: auto;
  display: flex;
  flex: 1;
  flex-direction: column;
  .main-con{
    display: flex;
    flex: 1;
    flex-direction: row;
  }
}
</style>
