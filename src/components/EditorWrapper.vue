<template>
  <div
    ref="editorWrapper"
    class="edit-wrapper"
    :style="styles"
    :data-component-id="id"
    :class="{active: active}"
    @click="onItemClick(id)"

    @mousedown="startMove"
  >
    <slot></slot>
    <div class="resizers">
      <div
        class="resizer top-left"
        @mousedown.stop="startResize('top-left')"
      ></div>
      <div
        class="resizer top-right"
        @mousedown.stop="startResize('top-right')"
      ></div>
      <div
        class="resizer bottom-left"
        @mousedown.stop="startResize('bottom-left')"
      ></div>
      <div
        class="resizer bottom-right"
        @mousedown.stop="startResize('bottom-right')"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import {pick} from 'lodash-es';
import {computed, defineComponent, nextTick, ref} from 'vue';
type ResizeDirection =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';
interface OriginPosition {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
export default defineComponent({
  props: {
    id: {
      type: String,
      requied: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    props: {
      type: Object,
    },
  },
  emits: ['setActive', 'update-postion'],
  setup(props, context) {
    const styles = computed(() =>
      pick(props.props, ['position', 'left', 'top', 'width', 'height'])
    );
    const gap = {
      x: 0,
      y: 0,
    };
    let isMoving = false;
    const caculateDis = (e: MouseEvent) => {
      const container = document.getElementById('canvas-area') as HTMLElement;
      const {offsetLeft, offsetTop, scrollTop} = container;
      const left = e.clientX - gap.x - offsetLeft;
      const top = e.clientY - gap.y - offsetTop + scrollTop;
      return {
        left,
        top,
      };
    };
    const caculateSize = (
      direction: ResizeDirection,
      e: MouseEvent,
      position: OriginPosition
    ) => {
      const {clientX, clientY} = e;
      const {left, right, top, bottom} = position;
      const container = document.getElementById('canvas-area') as HTMLElement;
      const {offsetTop, offsetLeft, scrollTop} = container;
      const rightWidth = clientX - left;
      const leftWidth = right - clientX;
      const bottomHeight = clientY - top;
      const topHeight = bottom - clientY;
      const topOffset = clientY - offsetTop + scrollTop;
      const leftOffset = clientX - offsetLeft;

      switch (direction) {
        case 'top-left':
          return {
            width: leftWidth,
            height: topHeight,
            top: topOffset,
            left: leftOffset,
          };
        case 'top-right':
          return {
            width: rightWidth,
            height: topHeight,
            top: topOffset,
          };
        case 'bottom-left':
          return {
            width: leftWidth,
            height: bottomHeight,
            left: leftOffset,
          };
        case 'bottom-right':
          return {
            width: rightWidth,
            height: bottomHeight,
          };
        default:
          break;
      }
    };

    const startResize = (direction: ResizeDirection) => {
      const editorElement = editorWrapper.value as HTMLElement;
      const {left, right, top, bottom} = editorElement.getBoundingClientRect();
      const handleMove = (e: MouseEvent) => {
        // if (editorElement) {
        //   // const { offsetLeft, offsetTop } = editorElement;
        //   const {left, top} = editorElement.getBoundingClientRect();
        //   editorElement.style.width = e.clientX - left + 'px';
        //   editorElement.style.height = e.clientY - top + 'px';
        // }
        const size = caculateSize(direction, e, {left, right, top, bottom});
        const {style} = editorElement;
        if (style && size) {
          style.width = size.width + 'px';
          style.height = size.height + 'px';
          if (size.left) {
            style.left = size.left + 'px';
          }
          if (size.top) {
            style.top = size.top + 'px';
          }
        }
      };
      const handleMouseUp = (e: MouseEvent) => {
        const size = caculateSize(direction, e, { left, right, top, bottom });
        context.emit('update-postion', { ...size, id: props.id });
        document.removeEventListener('mousemove', handleMove);
        nextTick(() => {
          document.removeEventListener('mouseup', handleMouseUp);
        });
      };
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    const startMove = (e: MouseEvent) => {
      const editorElement = editorWrapper.value;
      if (editorElement) {
        const {left, top} = editorElement.getBoundingClientRect();
        gap.x = e.clientX - left;
        gap.y = e.clientY - top;
      }

      const handleMove = (e: MouseEvent) => {
        isMoving = true;
        const {left, top} = caculateDis(e);
        // console.log(left, top);
        if (editorElement) {
          editorElement.style.left = left + 'px';
          editorElement.style.top = top + 'px';
        }
      };

      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleMove);
        if (isMoving) {
          const {left, top} = caculateDis(e);
          context.emit('update-postion', {left, top, id: props.id});
          isMoving = false;
        }

        nextTick(() => {
          document.removeEventListener('mouseup', handleMouseUp);
        });
      };
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    const editorWrapper = ref<null | HTMLElement>(null);
    const onItemClick = (id: string) => {
      context.emit('setActive', id);
    };

    return {
      onItemClick,
      styles,
      editorWrapper,
      startMove,
      startResize,
    };
  },
});
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
.edit-wrapper .resizers {
  display: none;
}
.edit-wrapper.active .resizers {
  display: block;
}
.edit-wrapper.active .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #1890ff;
  position: absolute;
}
.edit-wrapper .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}
.edit-wrapper .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>
