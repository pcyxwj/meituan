<template>
    <div class=""></div>
</template>

<script>
    export default {
      layout: 'blank',
      middleware: async(ctx) => {
        let {status,data} = await ctx.$axios.get('/users/exit');
        console.log(status + ',' + data + ',' + data.code)
        if(status === 200 && data && data.code === 0) {
         location.href = '/';
        }
      }
    }
</script>

<style scoped>

</style>
