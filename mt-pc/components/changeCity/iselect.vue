<template>
  <div class="m-iselect">
    <span class="name">按省份选择:</span>
    <el-select
      v-model="pvalue"
      placeholder="省份">
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <el-select
      v-model="cvalue"
      :disabled="!city.length"
      placeholder="城市">
      <el-option
        v-for="item in city"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <!--远程搜索组件-->
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市"
      @select="handleSelect"
    />
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  data(){
    return {
      //当前选中省份列表
      province:[],
      //当前选中省份
      pvalue:'',
      //当前选中省份的城市列表
      city:[],
      //当前选中省份的城市
      cvalue:'',
      input:'',
      //所有城市列表
      cities:[]
    }
  },
  watch:{
    pvalue:async function(newPvalue){
      let self=this;
      let {status,data:{city}}=await self.$axios.get(`/geo/province/${newPvalue}`)
      if(status===200){
        self.city=city.map(item=>{
          return {
            value:item.id,
            label:item.name
          }
        })
        self.cvalue=''
      }
    }
  },
  mounted:async function(){
    let self=this;
    let {status: status1,data:{province}}=await self.$axios.get('/geo/province')
    if(status1===200){
      self.province=province.map(item=>{
        return {
          value:item.id,
          label:item.name
        }
      })
    }
  },
  methods:{
    querySearchAsync:_.debounce(async function(query,cb){
      let self=this;
      //有数据时
      if(self.cities.length){
        cb(self.cities.filter(item => item.value.indexOf(query)>-1))
      }else{
        //没有数据时，先请求数据
        let {status,data:{city}}=await self.$axios.get('/geo/city')
        if(status===200){
          self.cities=city.map(item=>{return {
            value:item.name
          }})
          cb(self.cities.filter(item => item.value.indexOf(query)>-1))
        }else{
          cb([])
        }
      }
    },200),
    handleSelect:function(item){
      sessionStorage.setItem("city",item.value)
      window.location.href = `/`;
      this.$store.commit('geo/setPosition',sessionStorage.getItem("city"));
    },
  }
}

</script>

<style lang="scss">
  @import "@/assets/css/changeCity/iselect.scss";
</style>
