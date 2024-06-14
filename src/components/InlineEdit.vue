<template>
  <div class="inline-edit" @click.stop="handleClick" ref="wrapper">
    <input v-model="innerValue" v-if="isEditing" placeholder="文本不能为空" ref="inputRef"/>
    <slot v-else><span>{{ innerValue }}</span></slot>
  </div>
</template>

<script lang="ts">
import useClickOutside from '@/hooks/useClickOutside';
import useKeyPress from '@/hooks/useKeyPress';
import {defineComponent, nextTick, ref, watch} from 'vue';
export default defineComponent({
  name: 'InlineEdit',
  props: {
    value: {
      type: String, 
      requierd: true,
    }
  },
  emits: ['change'],
  setup(props, context) {
    const wrapper = ref < null | HTMLElement > (null);
    const isClickOutside = useClickOutside(wrapper);
    const inputRef = ref(null);
    const isEditing = ref(false);
    const innerValue = ref(props.value);
    let cachedOldValue = '';

    const handleClick = () => { 
      isEditing.value = true;
    }

    watch(isEditing, async (isEditing) => {
      if (isEditing) {
        cachedOldValue = innerValue.value;
        await nextTick(); // 在dom生成完成之后进行获取焦点的操作
        if (inputRef.value) {
          inputRef.value.focus();
        }
      }
    })

    watch(isClickOutside, (newValue) => {
      if (newValue && isEditing.value) {
        isEditing.value = false;
        context.emit('change', innerValue.value);
      }
      isClickOutside.value = false;
    })

    useKeyPress('Enter', () => {
      if (isEditing.value) {
        isEditing.value = false;
        context.emit('change', innerValue.value);
      }
    })

    useKeyPress('Escape', () => {
      if (isEditing.value) {
        isEditing.value = false;
        innerValue.value =  cachedOldValue;
      }
    })

    return {
      handleClick,
      wrapper,
      inputRef,
      innerValue,
      isEditing
    }
  }
});
</script>

<style>
.inline-edit {
  cursor: pointer;
  min-width: 60%;
}
.ant-input.input-error {
  border: 1px solid #f5222d;
}
.ant-input.input-error:focus {
  border-color: #f5222d;
}
.ant-input.input-error::placeholder {
  color: #f5222d;
}
</style>
