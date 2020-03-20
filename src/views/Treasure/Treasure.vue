<template>
   <div class="treasure">
     <div class="content">
       <div class="c-header" v-if=false>
         财富
       </div>
       <cash-withdrawal/>
     </div>
    <footer-bar
      />
   </div>
</template>

<script type="text/ecmascript-6">
import FooterBar from '@/components/FooterBar/FooterBar'
import CashWithdrawal from '@/views/CashWithdrawal/CashWithdrawal'

export default {
  name: 'Treasure',
  data () {
    return {}
  },
  components: { FooterBar, CashWithdrawal }
}
</script>

<style scoped lang="less">
.treasure {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .content {
    font-size: 50px;
    height: 92%;
    width: 100%;
    display: flex;
    flex: 1;
    .c-header {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 40px;
      color: #fff;
      font-weight: 500;
      background-color: #4d6ffd
    }
  }
  .footer {
    height: 120px;
    width: 100%
  }
}
</style>
