import { createApp } from 'vue'
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import App from './App.vue'
import Antd from './configAntD'
import 'ant-design-vue/dist/antd.less'
import 'lego-bricks/dist/bundle.css'
import 'cropperjs/dist/cropper.css'
export type ICustomAxiosConfig = AxiosRequestConfig & {
  opName?: string;
}

const app = createApp(App)
app.use(Antd)
app.mount('#app')

