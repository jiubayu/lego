<template>
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
export default defineComponent({
  name: 'App',
  // setup() {
  // },
});
</script>
<style>
.app-container .global-spinner {
  position: fixed;
  top: 10px;
  right: 50%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  color: #fff;
}
</style>
