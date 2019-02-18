<template>
  <div class="m-user">
    <template v-if="user">
      欢迎您，<span class="userName">{{ user }}</span>
      [<nuxt-link to="/exit">退出</nuxt-link>]
    </template>
    <template v-else>
      <nuxt-link
        to="/login"
        class="login">立即登录  </nuxt-link>
      <nuxt-link
        to="/register"
        class="register">注册</nuxt-link>
    </template>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        user: ''
      }
    },
    async mounted() {
      // this.$axios.get('users/getUser')请求接口
      const {status, data:{user}} = await this.$axios.get('/users/getUser');
      //如果接口返回成功
      if(status === 200) {
        this.user = user;
      }
    }
  }
</script>

