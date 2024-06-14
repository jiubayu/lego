<template>
  <ul :list="list" class="ant-list-items ant-list-bordered" @drop="onDrop">
    <li
      class="ant-list-item"
      :class="{
        active: selectedId === element.id,
        ghost: dragData.currentDragId === element.id,
      }"
      v-for="(element, key) in list"
      @click="handleClick(element.id)"
      :key="key"
      :data-index="key"
      draggable="true"
      @dragstart="onDragStart($event, element.id, key)"
      @dragover="onDragOver"
      @dragenter="onDragEnter($event, key)"
    >
      <a-tooltip :title="element.isHidden ? '显示' : '隐藏'">
        <a-button
          shape="circle"
          @click.stop="handleChange(element.id, 'isHidden', !element.isHidden)"
        >
          <template v-slot:icon v-if="element.isHidden"
            ><EyeOutlined />
          </template>
          <template v-slot:icon v-else><EyeInvisibleOutlined /> </template>
        </a-button>
      </a-tooltip>
      <a-tooltip :title="element.isLocked ? '解锁' : '锁定'">
        <a-button
          shape="circle"
          @click="handleChange(element.id, 'isLocked', !element.isLocked)"
        >
          <template v-slot:icon v-if="element.isLocked"
            ><UnlockOutlined />
          </template>
          <template v-slot:icon v-else><LockOutlined /> </template>
        </a-button>
      </a-tooltip>
      <!-- <span>{{ element.layerName }}</span> -->
      <inline-edit
        :value="element.layerName"
        @change="(value) => handleChange(element.id, 'layerName', value)"
      />
      <a-tooltip title="拖动排序">
        <a-button shape="circle" class="handle">
          <template v-slot:icon><DragOutlined /> </template
        ></a-button>
      </a-tooltip>
    </li>
  </ul>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, reactive, watch} from 'vue';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  UnlockOutlined,
  DragOutlined,
} from '@ant-design/icons-vue';
import {ComponentData} from '../store/editor';
import InlineEdit from './InlineEdit.vue';
import { getElement } from '@/helper/index';
import {arrayMoveMutable} from 'array-move';
export default defineComponent({
  name: 'LayerList',
  components: {
    EyeOutlined,
    EyeInvisibleOutlined,
    LockOutlined,
    UnlockOutlined,
    DragOutlined,
    InlineEdit,
  },
  props: {
    list: {
      type: Array as PropType<ComponentData[]>,
      required: true,
    },
    selectedId: {
      type: String,
      required: true,
    },
  },
  emits: ['change', 'setActive', 'drop'],
  setup(props, context) {
    const dragData = reactive({
      currentDragId: '',
      currentIndex: -1,
    });
    let start = -1;
    let end = -1;
    const handleClick = (id: string) => {
      context.emit('setActive', id);
    };
    const handleChange = (id: string, key: string, value: boolean) => {
      const data = {id, key, value, isRoot: true};
      context.emit('change', data);
    };

    const onDragStart = (e: DragEvent, id: string, index: number) => {
      dragData.currentDragId = id;
      dragData.currentIndex = index;
      start = index;
    };
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const onDragEnter = (e: DragEvent, index: number) => {
      if (index !== dragData.currentIndex) {
        // console.log(index, dragData.currentIndex, 'currentIndex');
        arrayMoveMutable(props.list, dragData.currentIndex, index);
        dragData.currentIndex = index;
        end = index;
      }
    }
    const onDrop = (e: DragEvent) => {
      // const currentEle = e.target as HTMLElement;
      // const parentEle = getElement(currentEle, 'ant-list-item');
      // if (parentEle.dataset) {
      //   const moveIndex = parseInt(parentEle.dataset.index);
      //   arrayMoveMutable(props.list, dragData.currentIndex, moveIndex);
      // }
      context.emit('drop', {start, end})
      dragData.currentDragId = '';
    };
    return {
      handleChange,
      handleClick,
      dragData,
      onDragStart,
      onDragOver,
      onDrop,
      onDragEnter
    };
  },
});
</script>

<style scoped>
.ant-list-item {
  padding: 10px 15px;
  transition: all 0.5s ease-out;
  cursor: pointer;
  justify-content: normal;
  border: 1px solid #fff;
  border-bottom-color: #f0f0f0;
}
.ant-list-item.active {
  border: 1px solid #1890ff;
}
.ant-list-item.ghost {
  opacity: 0.5;
}

.ant-list-item:hover {
  background: #e6f7ff;
}
.ant-list-item > * {
  margin-right: 10px;
}
.ant-list-item button {
  font-size: 12px;
}

.ant-list-item .handle {
  cursor: move;
  margin-left: auto;
}
.ant-list-item .edit-area {
  width: 100%;
}
</style>
