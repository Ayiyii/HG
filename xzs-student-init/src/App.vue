<template>
  <div id="app">
    <router-view />
    <back-to-top :visibility-height="100" :back-position="0" transition-name="fade" ref="backTop"/>
  </div>

</template>

<script>

import BackToTop from '@/components/BackToTop'

export default {
  name: 'App',
  components: {
    BackToTop
  }
}
</script>
<style>
html,body,#app{
 		height: 100%;
 		width: 100%;
	}
  /*element-ui解决高度自适应*/
  .el-container{
    	height: 100% !important;
 		width: 100%;
  }
</style>
