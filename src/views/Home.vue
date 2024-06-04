<template>
  <div class="content-container">
    <template-list :list="testData.data"></template-list>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {useStore} from 'vuex';
import TemplateList from '../components/TemplateList.vue';
import { GlobalDataProps } from '../store'
// import UserProfile from '../components/UserProfile.vue'

export default defineComponent({
  name: 'Home',
  components: {
    TemplateList,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const testData = computed(() => store.state.templates);
    return {
      testData,
    };
  },
});
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  color: #fff;
}
</style>
