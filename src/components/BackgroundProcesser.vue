<template>
  <div class="background-processer">
    <styled-uploader v-if="!value" @success="onImageUploaded"></styled-uploader>
    <image-processer
      v-else
      :value="value"
      @change="handleUploadUrl"
      :showDelete="true"
    >
    </image-processer>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {message} from 'ant-design-vue';
import ImageProcesser from './ImageProcesser.vue';
import StyledUploader from './StyledUploader.vue';
import {RespUploadData} from '../store/respTypes';

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    }
  },
  components: {
    ImageProcesser,
    StyledUploader
  },
  emits: ['change'],
  setup(props, context) {
    console.log(props, 'props----')
    const onImageUploaded = (data: { resp: RespUploadData; file: File }) => {
      const { resp } = data;
      message.success('上传成功')
      context.emit('change', resp.data.urls[0])
    }
    const handleUploadUrl = (url: string) => {
      context.emit('change', url)
    }
    return {
      onImageUploaded,
      handleUploadUrl
    }
  }
});
</script>

<style lang="scss" scoped></style>
