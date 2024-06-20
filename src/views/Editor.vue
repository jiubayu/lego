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
          <p>画布区域</p>
          <history-area></history-area>
          <div class="preview-list" id="canvas-area">
            <div class="body-container" :style="page.props">
              <editor-wrapper
                v-for="component in components"
                :key="component.id"
                :id="component.id"
                :active="component.id === currentId"
                :hidden="component.isHidden"
                :props="component.props"
                @setActive="setActive(component.id)"
                @update-postion="updatePosition"
              >
                <component :is="component.name" v-bind="component.props" />
              </editor-wrapper>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider
        width="360"
        style="background: #fff"
        class="settings-panel"
      >
        <a-tabs type="card" v-model="activePanel">
          <a-tab-pane key="component" tab="属性设置" class="no-top-radius">
            <div v-if="currentElement">
              <edit-group
                v-if="!currentElement.isLocked"
                :props="currentElement.props"
                @change="handleChange"
              ></edit-group>
              <div v-else>
                <a-empty>
                  <template #description>
                    <p>该元素被锁定，无法编辑</p>
                  </template>
                </a-empty>
              </div>
              <!-- <pre> {{ currentElement && currentElement.props }}</pre> -->
            </div>
          </a-tab-pane>
          <a-tab-pane key="layer" tab="图层设置">
            <layer-list
              :list="components"
              :selectedId="currentId"
              @change="handleChange"
              @setActive="setActive"
            />
          </a-tab-pane>
          <a-tab-pane key="page" tab="页面设置">
            <props-table
              :props="page.props"
              @change="handlePageChange"
            ></props-table>
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import {GlobalDataProps} from '@/store';
import {computed, defineComponent, nextTick, onMounted, ref} from 'vue';
import {useStore} from 'vuex';
// import LText from '@/components/LText.vue';
import ComponentList from '../components/ComponentList.vue';
import defaultTemplates from '@/defaultTemplates';
import {ComponentData} from '@/store/editor';
import EditorWrapper from '../components/EditorWrapper.vue';
import PropsTable from '@/components/PropsTable.vue';
import LayerList from '../components/LayerList.vue';
// import PropsTable from '@/components/PropsTable';
import Uploader from '@/components/Uploader.vue';
import {v4 as uuidv4} from 'uuid';
import EditGroup from '../components/EditGroup.vue';
import {forEach, pickBy} from 'lodash-es';
import initHotKeys from '@/plugins/hotKeys';
import HistoryArea from './editor/HistoryArea.vue';
// import ContextMenu from '@/components/ContextMenu.vue';
import createContextMenu from '@/components/createContextmenu';
import initContextMenu from '@/plugins/contextMenu';

export type TabType = 'component' | 'layer' | 'page';
export default defineComponent({
  name: 'Editor',
  components: {
    ComponentList,
    EditorWrapper,
    PropsTable,
    Uploader,
    LayerList,
    EditGroup,
    HistoryArea,
  },
  setup() {
    initHotKeys();
    initContextMenu();
    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components);
    const currentId = computed(() => store.state.editor.currentId);
    const currentElement = computed<ComponentData | null>(
      () => store.getters.getCurrentComponent
    );
    const page = computed(() => store.state.editor.page);
    const activePanel = ref<TabType>('component');
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
      console.log(e, 'e---');
      store.commit('updateComponent', {id: currentId.value, ...e});
    };
    const handlePageChange = (e: any) => {
      console.log(e, 'e----');
      store.commit('updatePage', e);
    };
    const updatePosition = (data: {left: number; top: number; id: string}) => {
      const {id} = data;
      const updateData = pickBy<number>(data, (v, k) => k !== 'id');
      const keys = Object.keys(updateData);
      const values = Object.values(updateData).map((v) => v + 'px');
      store.commit('updateComponent', {key: keys, value: values, id});
    };
    return {
      components,
      defaultTemplates,
      addItem,
      deleteItem,
      setActive,
      currentElement,
      handleChange,
      activePanel,
      currentId,
      page,
      handlePageChange,
      updatePosition,
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
