<template>
  <div class="homepage-container">
    <a-layout :style="{background: '#fff'}">
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">慕课乐高</router-link>
        </div>
        <user-profile :user="user"></user-profile>
      </a-layout-header>
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
    <a-layout-footer>
      © 慕课网（imooc.com）版权所有 | 津ICP备20000929号-2
    </a-layout-footer>
  </div>
</template>

<script lang="ts">
import { GlobalDataProps } from '@/store';
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import UserProfile from '../components/UserProfile.vue';
// import { useRoute } from 'vue-router';
export default defineComponent({
  name: 'Index',
  components: {
    UserProfile 
  },
  setup() {
    // const route = useRoute();
    // 解决首尾布局两种方式
    // 1 通过route.meta.withHeader来动态控制是否应该显示首尾
    // 2 通过路由的多层嵌套来解决是否显示首尾布局
    // const widthHeader = computed(() => route.meta.widthHeader);
    const store = useStore<GlobalDataProps>();
    const user = computed(() => store.state.user);
    console.log(user.value, 'user--')
    return {
      // widthHeader
      user
    }
  }
})
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
