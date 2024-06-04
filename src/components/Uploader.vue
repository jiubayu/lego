<template>
  <div class="file-upload">
    <div
      class="upload-area"
      v-on="events"
      :class="{'is-dragover': drag && isDargOver}"
    >
      <slot v-if="isUplaoding" name="loading">
        <button class="file-icon" disabled><LoadingOutlined /></button>
      </slot>
      <slot
        v-else-if="lastFileData && lastFileData.loaded"
        name="uploaded"
        :uploadedData="lastFileData.data"
      >
        <button>点击上传</button>
      </slot>
      <slot v-else name="default">
        <span class="file-icon"><FileOutlined /></span>
      </slot>
    </div>
    <input
      type="file"
      ref="fileInput"
      :style="{display: 'none'}"
      @change="handleFileChange"
    />
    <ul class="upload-list"  v-if="showUploadList">
      <li
        :class="`uploaded-file upload-${file.status}`"
        v-for="file in fileList"
        :key="file.uid"
      >
        <span class="filename">{{ file.name }}</span>
        <button class="delete-icon" @click="removeFile(file.uid)"
          ><DeleteOutlined
        /></button>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import {PropType, computed, defineComponent, reactive, ref} from 'vue';
import {
  DeleteOutlined,
  LoadingOutlined,
  FileOutlined,
} from '@ant-design/icons-vue';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import {last} from 'lodash-es';

type UploadStatus = 'ready' | 'loading' | 'success' | 'fail';
type CheckUpload = (file: File) => boolean | Promise<File>;
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStatus;
  raw: File;
  resp?: any;
}
export default defineComponent({
  props: {
    action: {
      type: String,
    },
    beforeUpload: {
      type: Function as PropType<CheckUpload>,
    },
    drag: {
      type: Boolean,
      default: false,
    },
    autoUpload: {
      // 自动上传
      type: Boolean,
      default: true,
    },
    showUploadList: { // 是否展示上传列表
      type: Boolean,
      default: true
    }
  },
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined,
  },
  setup(props) {
    const fileInput = ref<HTMLInputElement | null>(null);
    const fileStatus = ref<UploadStatus>('ready');
    const fileList = ref<UploadFile[]>([]);
    const isDargOver = ref<boolean>(false);
    const isUplaoding = computed(() => {
      return fileList.value.some((file) => file.status === 'loading');
    });
    const lastFileData = computed(() => {
      const lastFile = last(fileList.value);
      if (lastFile) {
        return {
          loaded: lastFile.status === 'success',
          data: lastFile.resp,
        };
      }
      return false;
    });
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };
    function postFile(readyFile: UploadFile) {
      const formDate = new FormData();
      formDate.append(readyFile.name, readyFile.raw); 
      readyFile.status = 'loading';
      axios
        .post('http://localhost:7001/' + props.action, formDate, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          console.log(res.data);
          readyFile.status = 'success';
          readyFile.resp = res.data;
          fileStatus.value = 'success';
        })
        .catch((err) => {
          readyFile.status = 'fail';
          fileStatus.value = 'fail';
        })
        .finally(() => {
          if (fileInput.value) {
            fileInput.value.value = '';
          }
        });
    }
    // addFileToList
    function addFileToList(uploadedFile: File) {
      const fileObj = reactive<UploadFile>({
        uid: uuidv4(),
        size: uploadedFile.size,
        name: uploadedFile.name,
        status: 'loading',
        raw: uploadedFile,
      });
      fileList.value.push(fileObj);
      if (props.autoUpload) {
        postFile(fileObj);
      }
    }
    function beforeUploadCheck(files: null | FileList) {
      if (files) {
        const uploadedFile = files[0];
        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadedFile);
          if (result && result instanceof Promise) {
            result
              .then((processFile) => {
                if (processFile instanceof File) {
                  addFileToList(processFile);
                } else {
                  throw new Error('文件类型不正确');
                }
              })
              .catch((e) => {
                console.log(e, 'e----');
              });
          } else if (result === true) {
            addFileToList(uploadedFile);
          }
        } else {
          addFileToList(uploadedFile);
        }
      }
    }
    const uploadFiles = () => {
      return Promise.all(fileList.value.filter((file) => file.status === 'ready').map((readyFile) => postFile(readyFile)));
    }
    let events: {[key: string]: (e: any) => void} = {
      click: triggerUpload,
    };
    const handleFileChange = (e: Event) => {
      const {files} = e.target as HTMLInputElement;
      beforeUploadCheck(files);
    };
    const removeFile = (id: string) => {
      fileList.value = fileList.value.filter((file) => file.uid !== id);
    };
    const handleDrag = (e: DragEvent, over: boolean) => {
      e.preventDefault(); //阻止默认事件
      isDargOver.value = over;
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      isDargOver.value = false;
      if (e.dataTransfer) {
        console.log(e.dataTransfer.files, 'e.dataTransfer.files---');
        beforeUploadCheck(e.dataTransfer.files);
      }
    };
    if (props.drag) {
      events = {
        ...events,
        dragover: (e: DragEvent) => handleDrag(e, true),
        dragleave: (e: DragEvent) => handleDrag(e, false),
        drop: handleDrop,
      };
    }
    return {
      fileInput,
      fileStatus,
      isUplaoding,
      fileList,
      lastFileData,
      isDargOver,
      handleFileChange,
      triggerUpload,
      removeFile,
      handleDrag,
      handleDrop,
      uploadFiles,
      events,
    };
  },
});
</script>
<style lang="scss">
// .file-upload .upload-area {
//   background: #efefef;
//   border: 1px dashed #ccc;
//   // padding: 20px;
//   cursor: pointer;
//   text-align: center;
//   &:hover {
//     border: 1px solid #1890ff;
//   }
//   &.is-dragover {
//     border: 2px solid #1890ff;
//     background: rgba(#1890ff, 0.2);
//   }
// }
.upload-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.upload-list li {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  font-size: 14px;
  line-height: 1.8;
  margin-top: 5px;
  box-sizing: border-box;
  border-radius: 4px;
  min-width: 200px;
  position: relative;
  &:first-child {
    margin-top: 10px;
  }
  .upload-list-thumbnail {
    vertical-align: middle;
    display: inline-block;
    width: 70px;
    height: 70px;
    position: relative;
    z-index: 1;
    background-color: #fff;
    object-fit: cover;
  }
  .file-icon {
    svg {
      margin-right: 5px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .filename {
    margin-left: 5px;
    margin-right: 40px;
  }
  &.upload-fail {
    color: #f5222d;
    svg {
      color: #f5222d;
    }
  }
  .file-status {
    display: block;
    position: absolute;
    right: 5px;
    top: 0;
    line-height: inherit;
  }
  .delete-icon {
    display: none;
    position: absolute;
    right: 7px;
    top: 0;
    line-height: inherit;
    cursor: pointer;
  }
  &:hover {
    background-color: #efefef;
    .file-status {
      display: none;
    }
    .delete-icon {
      display: block;
    }
  }
}
</style>
