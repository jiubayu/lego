import { Module } from "vuex";
import { GlobalDataProps } from ".";

export interface TemplateProps {
  id: number;
  title?: string;
  coverImg: string;
  author?: string;
  copiedCount?: number;
}
export interface TemplatesProps {
  data: TemplateProps[];
}
const testData = [
  {
    id: 1,
    author: 'test',
    title: '前端架构师直播海报',
    coverImg:
      'https://pub-cdn-oss.chuangkit.com/materials/2024/03/11/2df5a19a-7d4a-4874-95be-51f5e715cd29?imageMogr2%2Fthumbnail%2F1200x1200%3E',
  },
  {
    id: 2,
    author: 'test',
    title: '前端架构师直播海报',
    coverImg:
      'https://pub-cdn-oss.chuangkit.com/materials/2024/03/11/2df5a19a-7d4a-4874-95be-51f5e715cd29?imageMogr2%2Fthumbnail%2F1200x1200%3E',
  },
  {
    id: 3,
    author: 'test',
    title: '前端架构师直播海报',
    coverImg:
      'http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png',
  },
  {
    id: 4,
    author: 'test',
    title: '前端架构师直播海报',
    coverImg:
      'https://pub-cdn-oss.chuangkit.com/materials/2024/03/11/2df5a19a-7d4a-4874-95be-51f5e715cd29?imageMogr2%2Fthumbnail%2F1200x1200%3E',
  },
  {
    id: 5,
    author: 'test',
    title: '前端架构师直播海报',
    coverImg:
      'https://pub-cdn-oss.chuangkit.com/materials/2024/03/11/2df5a19a-7d4a-4874-95be-51f5e715cd29?imageMogr2%2Fthumbnail%2F1200x1200%3E',
  },
];

const templates: Module<TemplatesProps,GlobalDataProps > = {
  state: {
    data: testData,
  },
  getters: {
    getTemplateById: (state) => (id: number) =>
      state.data.find((item: TemplateProps) => item.id === id),
  },
};
export default templates;