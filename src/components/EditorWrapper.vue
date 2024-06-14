<template>
  <div class="edit-wrapper" @click="onItemClick(id)" :class="{active: active,}">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    id: {
      type: String,
      requied: true
    },
    active: {
      type: Boolean,
      default: false
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  },
  emits: ['setActive'],
  setup(props,context) {
    const onItemClick = (id: string) => {
      context.emit('setActive', id);
    }
    return {
      onItemClick
    }
  }
})
</script>
<style>
  .edit-wrapper {
    padding: 0px;
    cursor: pointer;
    border: 1px solid transparent;
    user-select: none;
    box-sizing: content-box !important;
  }
  .edit-wrapper > * {
    position: static !important;
    width: 100% !important;
    height: 100% !important;
  }
  .edit-wrapper:hover {
    border: 1px dashed #ccc;
  }
  .edit-wrapper.hidden {
    display: none;
  }
  .edit-wrapper.active {
    border: 1px solid #1890ff;
    user-select: none;
    z-index: 1500;
  }
</style>