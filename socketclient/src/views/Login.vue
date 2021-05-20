<template>
 <div class="login">
    <a-input type="text" v-model="username" placeholder="用户名" /><br>
    <a-input type="text" v-model="password" placeholder="密码" /><br>
    <a-button @click="submit">登录</a-button>
 </div>
</template>

<script>
import axios from 'axios'
export default {
   data(){
     return{
       username:'admin',
       password:'123'
     }
   },
   methods:{
     submit(){
       if(this.username === '' || this.password === ''){
         alert('用户名或者密码不能为空')
         return
       }
       axios.post('http://localhost:4000/login',
       {username:this.username,password:this.password}
       ).then(res => {
         console.log(res)
         if(res.data.code !== 200){
           alert('用户名或者密码错误')
           return
         }
         this.$store.commit('setToken', res.data.token)
         this.$router.push({ name: 'Home' })
       })
     }
   }
}
</script>

<style>
.login{
  width: 200px;
  margin:200px auto;
}
</style>