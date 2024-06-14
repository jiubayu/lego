import LegoBriks from 'lego-birks';
import { createApp } from 'vue'
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import App from './App.vue'
import Antd from './configAntD'
import 'ant-design-vue/dist/antd.less'
import 'lego-birks/dist/lego-birks.css';
import 'cropperjs/dist/cropper.css'
import router from './routes'
import store from './store'

export type ICustomAxiosConfig = AxiosRequestConfig & {
  opName?: string;
}

const app = createApp(App)
app.use(Antd).use(LegoBriks).use(router).use(store);
app.mount('#app')

