<template>
  <iframe
    :src="src"
    id="dialogFrame"
    frameborder="0"
    class="ifclass"
    :style="{ height: tableHeight + 'px' }"
  ></iframe>
</template>
<script>
export default {
  data() {
    return {
      // src: "http://localhost:8099/swagger-ui/index.html",
      tableHeight: 0,
    };
  },
  computed:{
    src:function(){
      // console.log(this.$route)
      return this.$route.name
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight;
    });
  },
};
</script>

<style lang="scss" scoped>
.ifclass {
  width: 100%;
  height: 100%;
}
</style>
