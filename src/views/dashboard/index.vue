<template>
  <div style="margin:20px 20px;">
    首页
  </div>
</template>
<script>
var a = "222";
import {obj,open} from './index'
export default {
  data() {
    return {
      userInfo: {
        userName: ""
      }
    };
  },
  created(){
    console.log(a)
   
  }
};
</script>

<style lang="scss" scoped>
</style>