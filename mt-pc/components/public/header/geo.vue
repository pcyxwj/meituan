<template>
    <div class="m-geo">
      <i v-if="position.length" class="el-icon-location">{{ $store.state.geo.position.city }}</i>
      <i v-else="position.length" class="el-icon-location">无法获取位置</i>
        <nuxt-link
          class="changeCity"
          to="/changeCity">切换城市
        </nuxt-link>
         [香河 廊坊 天津]
    </div>
</template>

<script>
    export default {
      data (){
        return {
          position: ''
        }
      },
      async mounted() {
        const {status, data:{city}} = await this.$axios.get('/geo/getPosition');
        //如果接口返回成功
        if(status === 200) {
          this.position = city;
        }
      }
    }
</script>

<style scoped>

</style>
