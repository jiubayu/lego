<template>
  <div class="editor-container">
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <img
            alt="慕课乐高"
            src="../assets/logo-simple.png"
            class="logo-img"
          />
        </div>
      </a-layout-header>
    </a-layout>
    <a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <div class="sidebar-container">
          组件列表
          <component-list
            :list="defaultTemplates"
            @onItemClick="addItem"
          ></component-list>
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域 <a-button @click="deleteItem()">删除</a-button></p>
          <div class="preview-list" id="canvas-area">
            <editor-wrapper
              v-for="component in components"
              :key="component.id"
              :id="component.id"
              :active="component.id === (currentElement && currentElement.id)"
              @setActive="setActive(component.id)"
            >
              <component :is="component.name" v-bind="component.props" />
            </editor-wrapper>
          </div>
          <!-- <history-area></history-area> -->
          <!-- <div class="preview-list" id="canvas-area" :class="{'canvas-fix': canvasFix}">
          <div class="body-container" :style="page.props">
          </div>
        </div> -->
        </a-layout-content>
      </a-layout>
      <a-layout-sider
        width="360"
        style="background: #fff"
        class="settings-panel"
      >
        组件属性
        <props-table
          v-if="currentElement && currentElement.props"
          :props="currentElement.props"
          @change="handleChange"
        ></props-table>
        <pre>
        {{ currentElement && currentElement.props }}
      </pre
        >
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import {GlobalDataProps} from '@/store';
import {computed, defineComponent} from 'vue';
import {useStore} from 'vuex';
import LText from '@/components/LText.vue';
import ComponentList from '../components/ComponentList.vue';
import defaultTemplates from '@/defaultTemplates';
import {ComponentData} from '@/store/editor';
import EditorWrapper from '../components/EditorWrapper.vue';
import PropsTable from '@/components/PropsTable.vue';
// import PropsTable from '@/components/PropsTable';
import Uploader from '@/components/Uploader.vue';
import {v4 as uuidv4} from 'uuid';
export type TabType = 'component' | 'layer' | 'page';
export default defineComponent({
  name: 'Editor',
  components: {
    LText,
    ComponentList,
    EditorWrapper,
    PropsTable,
    Uploader
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components);
    const currentId = computed(() => store.state.editor.currentId);
    const currentElement = computed<ComponentData | null>(
      () => store.getters.getCurrentComponent
    );
    console.log(currentElement, 'currentElement----')
    const addItem = (props: any) => {
      store.commit('addComponent', {
        id: uuidv4(),
        name: 'l-text',
        props,
      });
    };
    const deleteItem = () => {
      store.commit('deleteComponent', currentId.value);
    };
    const setActive = (id: string) => {
      store.commit('setActive', id);
    };
    const handleChange = (e: any) => {
      console.log(e,'e---')
      store.commit("updateComponent", { id: currentId.value, ...e});
    };
    return {
      components,
      defaultTemplates,
      addItem,
      deleteItem,
      setActive,
      currentElement,
      handleChange
    };
  },
});
</script>
<style>
.editor-container .preview-container {
  padding: 24px;
  margin: 0;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.editor-container .preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 400px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
.page-title {
  display: flex;
}
.component-container {
  position: relative !important;
}
.page-title .inline-edit span {
  font-weight: 500;
  margin-left: 10px;
  font-size: 16px;
}
.preview-list.canvas-fix .edit-wrapper > * {
  box-shadow: none !important;
}
.preview-list.canvas-fix {
  position: absolute;
  max-height: none;
}
</style>
