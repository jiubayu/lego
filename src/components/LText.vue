<template>
  <component
    :is="tag"
    :style="styleProps"
    class="l-test-component"
    @click="handleClick"
  >
    {{ text }}
  </component>
</template>
<script lang="ts">
import {computed, defineComponent} from 'vue';
import {
  transformToComponentProps,
  textDefaultProps,
  textStylePropNames,
} from '@/defaultProps';
import useComponentCommon from '@/hooks/useComponentCommon';
const defaultProps = transformToComponentProps(textDefaultProps);
export default defineComponent({
  name: 'LText',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    ...defaultProps,
  },
  setup(props) {
    const {styleProps, handleClick} = useComponentCommon(
      props,
      textStylePropNames
    );
    return {
      styleProps,
      handleClick,
    };
  },
});
</script>
