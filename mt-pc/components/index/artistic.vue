<template>
  <div class="m-istyle">
    <dl>
      <dt>有格调</dt>
      <dd
        v-for="item in menu"
        :key="item.type">{{item.name}}</dd>
    </dl>
    <div class="ibody"
         v-if="kind">
      <template v-for="item in menu.child">
        {{item.name}}
      </template>
    </div>
  </div>
</template>

<script>
    export default {
      data() {
        return {
          kind: '',
          menu:[{
            type:'food',
            name:'美食',
            child:[{
              title:'美食',
              child:['代金券','甜点饮品','火锅','自助餐','小吃快餐']
            }]
          },{
            type:'takeout',
            name:'外卖',
            child:[{
              title:'外卖',
              child:['美团外卖']
            }]
          },{
            type:'hotel',
            name:'酒店',
            child:[{
              title:'酒店星级',
              child:['经济型','舒适/三星','高档/四星','豪华/五星']
            }]
          }]
        }
      }
    }
</script>

<style lang="scss">
  @import "@/assets/css/index/artistic.scss";
</style>

