<template>
  <div class="m-crumbs">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">{{ mcity }}</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">{{ decodeURIComponent(keyword) }}</a></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data(){
    return {
      mcity: ''
    }
  },
  props: {
    keyword: {
      type: String,
      default: ''
    }
  },
  async mounted() {
    const {status, data:{city}} = await this.$axios.get('/geo/getPosition');
    if (sessionStorage.getItem("city")) {
      this.mcity = sessionStorage.getItem("city").replace('市','')
    }
  }
}
</script>
