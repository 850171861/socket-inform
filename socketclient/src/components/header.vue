<template>
  <div class="header">
    <span class="login" v-if="token === ''">登录才能收到信息去<router-link to="/login">登录</router-link></span>
    <span style="margin-right:24px">
      <a-badge :count="num.message">
        <a-avatar shape="square" icon="user"/>
        </a-badge>
      
    </span>
        <div class="tips" v-show="hasMsg">
          <div class="content">
            您有{{num.message}}条新订单
          </div>
        </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Header',
  data () {
    return {
      isHover: false,
      hoverCtrl: {},
      hasMsg: false
    }
  },
   computed: {
    ...mapState({
      num: (state) => state.num,
      token:(state) => state.token
    }),
   },
  
  methods: {
  },
   watch: {
    num (newval, oldval) {
      if (newval.event && newval !== oldval) {
        // 判断消息数量
        if (newval.message && newval.message > 0) {
          this.hasMsg = true
          setTimeout(() => {
            this.hasMsg = false
          }, 2000)
        }
      }
    }
  },

 
 
}
</script>

<style scope>
 .header{
   background: #1C1C1C;
   height: 60px;
   width: 100%;
 }
 .login{
   color: #ffffff;
 }
 .ant-badge{
   margin-top: 14px  !important;
 }
 .tips{
   position: absolute;
   background: #6B6B6B;
   padding: 6px;
   left: 50%;
   transform: translateX(-50%);
   color: #F98300;
 }

</style>