<template>
  <div class="create-componnet-list">
    <div
      class="component-item"
      v-for="(item, index) in list"
      :key="index"
      @click="onItemClick(item)"
    >
      <l-text v-bind="item"></l-text>
    </div>
  </div>
  <styled-uploader @success="onImageUploaded"></styled-uploader>
</template>
<script lang="ts">
import {PropType, defineComponent} from 'vue';
import {TextComponentProps, imageDefaultProps} from '@/defaultProps';
import LText from './LText.vue';
import StyledUploader from './StyledUploader.vue';
import {RespUploadData} from '@/store/respTypes';
import {ComponentData} from '@/store/editor';
import {v4 as uuidv4} from 'uuid';
import {message} from 'ant-design-vue';
export default defineComponent({
  name: 'ComponentList',
  components: {
    LText,
    StyledUploader,
  },
  props: {
    list: {
      type: Array as PropType<Array<TextComponentProps>>,
      required: true,
    },
  },
  emits: ['on-item-click'],
  setup(props, context) {
    const onItemClick = (data: any) => {
      console.log(data, 'data----');
      context.emit('on-item-click', data);
    };
    const onImageUploaded = (data: {resp: RespUploadData; file: File}) => {
      const {resp, file} = data;
      const componentData: ComponentData = {
        name: 'l-image',
        id: uuidv4(),
        props: {
          ...imageDefaultProps,
        },
      };
      message.success('上传成功');
      componentData.props.imageSrc = resp.data.urls[0];
      context.emit('on-item-click', componentData);
      console.log(resp, 'resp---');
    };
    return {
      onItemClick,
      onImageUploaded,
    };
  },
});
</script>
<style>
.component-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
}
.component-item > * {
  position: static !important;
}
</style>
