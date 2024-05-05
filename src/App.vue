<template>
  <div class="app-container">
    <h1>1111</h1>
    <hello />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Hello from './components/hello'; 
export default defineComponent({
  name: 'App',
  components: {
    Hello,
  }
})
</script>
<style>
.app-container .global-spinner {
  position: fixed;
  top: 10px;
  right: 50%;
}
</style>
