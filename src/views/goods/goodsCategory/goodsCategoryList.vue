<template>
  <div @click="change()">{{message}}</div>
</template>

<script>
import Vue from 'vue'
export default {
  data(){
    return {
      obj:{
        a:"aaa",
        b:"bbb"
      }
    }
  },
  created(){
    console.log(this.obj)
    this.obj.c = "ccc"
    console.log(this.obj)
    // 不可用
    // this.$set(this.message,"商品分类")
    this.message = "商品分类"
    // 把值变为响应式的
    Vue.util.defineReactive(this, 'message');
  },
  methods:{
    change(){
      console.log(321)
      this.message = "asdsad"
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
