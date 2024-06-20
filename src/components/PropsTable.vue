<template>
  <div class="props-table">
    <div v-for="(value, key) in finalProps" :key="key" class="prop-item">
      <span class="label" v-if="value.text">{{ value.text }}</span>
      <div :class="`prop-component component-${value.component}`">
        <component
          v-if="value"
          :is="value.component"
          :[value.valueProp]="value.value"
          v-bind="value.extraProps"
          v-on="value.events"
        >
          <template v-if="value.subComponent">
            <component
              :is="value.subComponent"
              v-for="(item, key) in value.options"
              :key="key"
              :value="item.value"
            >
              <render-vnode :vNode="item.text"></render-vnode>
              <!-- {{ item.label }} -->
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {TextComponentProps} from '@/defaultProps';
import {computed, defineComponent, Fragment, PropType, VNode} from 'vue';
import {reduce} from 'lodash-es';
import {mapPropsToForms, PropsToForms} from '@/propsMap';
import RenderVNode from './RenderVNode';
import ColorPicker from './ColorPicker.vue';
import ImageProcesser from './ImageProcesser.vue';
import BackgroundProcesser from './BackgroundProcesser.vue';
import IconSwitch from './IconSwitch.vue'
import { AllComponentProps } from 'lego-birks';

interface FormProps {
  component: string;
  subComponent?: string;
  value: string;
  extraProps?: {[key: string]: any};
  text?: string;
  options?: {text: string | VNode; value: any}[];
  valueProp?: string;
  eventName?: string;
  events: {[key: string]: (e: any) => void};
}
export default defineComponent({
  name: 'props-table',
  components: {
    RenderVNode,
    ColorPicker,
    ImageProcesser,
    BackgroundProcesser,
    IconSwitch
  },
  props: {
    props: {
      type: Object as PropType<AllComponentProps>,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, context) {
    const finalProps = computed(() => {
      return reduce(
        props.props,
        (result, value, key) => {
          const newKey = key as keyof TextComponentProps;
          const item = mapPropsToForms[newKey];
          if (item) {
            const {
              valueProp = 'value',
              eventName = 'change',
              initalTransform,
              afterTransform,
            } = item;
            const newItem: FormProps = {
              ...item,
              valueProp,
              value: initalTransform ? initalTransform(value) : value,
              eventName,
              events: {
                [eventName]: (e: any) =>
                  context.emit('change', {
                    key,
                    value: afterTransform ? afterTransform(e) : e,
                  }),
              },
            };
            result[newKey] = newItem;
          }
          return result;
        },
        {} as {[key: string]: FormProps}
      );
    });
    return {
      finalProps,
    };
  },
});
</script>
<style>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}
.label {
  width: 28%;
}
.prop-component {
  width: 70%;
}
.prop-item.no-text {
  display: inline-block;
  margin: 0 10px 0 0;
}
#item-fontWeight {
  margin-left: 28%;
}
.component-a-select .ant-select {
  width: 150px;
}
.prop-component.component-shadow-picker,
.prop-component.component-image-processer,
.prop-component.component-background-processer {
  width: 100%;
}
</style>
