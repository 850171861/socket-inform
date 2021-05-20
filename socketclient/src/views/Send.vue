<template>
  <div class="send">
    <a-button type="danger" @click="submit">下单</a-button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
   methods:{
     submit(){
       axios.post('http://localhost:4000/order',
       { 
         number:1,
         isRead:0
       }
        ).then(res => {
          if(res.data.code === 200){
            this.$message.info('下单成功');
          }else{
            this.$message.info('下单失败');
          }
        })
     }
   }
}
</script>

<style>
.send{
  margin-top: 200px;
}
</style>