<template>
  <div class="m-geo">
    <i class="el-icon-location">{{ $store.state.geo.position }}</i>
    <nuxt-link
      class="changeCity"
      to="/changeCity">切换城市
    </nuxt-link>
  </div>
</template>

<script>
  export default {
    data (){
      return {
      }
    },
    async mounted() {
      const {status, data:{city}} = await this.$axios.get('/geo/getPosition');
      //如果接口返回成功
      if(status === 200 && !sessionStorage.getItem("city")) {
        sessionStorage.setItem("city", city);
      }
      if (sessionStorage.getItem("city") !== '') {
        this.$store.commit('geo/setPosition', sessionStorage.getItem("city"));
      }
    }
  }
</script>

<style scoped>

</style>
