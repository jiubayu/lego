import {v4 as uuidv4} from 'uuid';
import {Module} from 'vuex';
import {GlobalDataProps} from '.';
import {TextComponentProps, AllComponentProps} from '@/defaultProps';
import {textDefaultProps, imageDefaultProps} from 'lego-birks';

export interface EditorProps {
  // 供中间渲染的组件列表
  components: ComponentData[];
  // 当前使用的组件名称
  currentElement: string;
  // 当前组件的id
  currentId: string;
}

export interface ComponentData {
  props: Partial<AllComponentProps>;
  // 用于区分，使用uuid生成
  id: string;
  // 业务组件名称 如l-text，l-image等
  name: string;
  layerName?: string;
  isHidden?: boolean;
  isLocked?: boolean;
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    layerName: '图层1',
    isHidden: false,
    isLocked: false,
    props: {
      ...textDefaultProps,
      text: 'hello',
      fontSize: '20px',
      color: '#000000',
      lineHeight: '1',
      textAlign: 'center',
    },
  },
  {
    id: uuidv4(),
    name: 'l-text',
    layerName: '图层2',
    isHidden: false,
    isLocked: false,
    props: {
      ...textDefaultProps,
      text: 'hello2',
      fontSize: '16px',
      fontWeight: 'bold',
      lineHeight: '2',
      fontFamily: 'FangSong',
    },
  },
  {
    id: uuidv4(),
    name: 'l-text',
    layerName: '图层3',
    isHidden: false,
    isLocked: false,
    props: {
      ...textDefaultProps,
      text: 'hello3',
      fontSize: '24px',
      backgroundColor: 'yellow',
      actionType: 'url',
      // url: 'http://baidu.com',
    },
  },
  {
    id: uuidv4(),
    name: 'l-image',
    layerName: '图层4',
    isHidden: false,
    isLocked: false,
    props: {
      ...imageDefaultProps,
      src: 'https://static.imooc-lego.com/upload-files/%E5%A4%B4%E5%83%8F1-508783.png',
    },
  },
];

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    currentId: '',
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      // const newComponents: ComponentData = {
      //   id: uuidv4(),
      //   name: 'l-text',
      //   props,
      // };
      state.components.push(component);
    },
    deleteComponent(state, currId: string) {
      state.components = state.components.filter(
        (item: ComponentData) => item.id !== currId
      );
    },
    updateComponent(state, {key, value, id, isRoot}) {
      const currentElement = state.components.find(
        (item) => item.id === (id || state.currentElement)
      );
      if (currentElement) {
        if (isRoot) {
          (currentElement as any)[key] = value;
        } else {
          currentElement.props[key as keyof TextComponentProps] = value;
        }
      }
    },
    setActive(state, currentId: string) {
      state.currentId = currentId;
    },
  },
  getters: {
    getCurrentComponent: (state) => {
      return state.components.find((item) => item.id === state.currentId);
    },
  },
};

export default editor;
