<template>
<div class="editor-container">
  <a-layout>
    <a-layout-header class="header">
      <div class="page-title">
         <img alt="慕课乐高" src="../assets/logo-simple.png" class="logo-img">
      </div>

    </a-layout-header>
  </a-layout>
  <a-layout>
    <a-layout-sider width="300" style="background: #fff">
      <div class="sidebar-container">
        组件列表
      </div>
    </a-layout-sider>
    <a-layout style="padding: 0 24px 24px">
      <a-layout-content class="preview-container">
        <p>画布区域</p>
        <history-area></history-area>
        <!-- <div class="preview-list" id="canvas-area" :class="{'canvas-fix': canvasFix}">
          <div class="body-container" :style="page.props">
          </div>
        </div> -->
      </a-layout-content>
    </a-layout>
    <a-layout-sider width="300" style="background: #fff" class="settings-panel">
    </a-layout-sider>  
  </a-layout>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export type TabType = 'component' | 'layer' | 'page'
export default defineComponent({
  name: 'Editor'
})
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
  min-height: 200px;
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