import {v4 as uuidv4} from 'uuid';
import {Module} from 'vuex';
import {GlobalDataProps} from '.';
import {TextComponentProps, AllComponentProps} from '@/defaultProps';

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
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
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
    props: {
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
    props: {
      text: 'hello3',
      fontSize: '24px',
      backgroundColor: 'yellow',
      actionType: 'url',
      url: 'http://baidu.com',
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
    updateComponent(state, props: {[key: string]: string} & {id: string}) {
      const { id, ...restProps } = props;
      const currentElement = state.components.find(
        (item) => item.id === id
      );
      const {key, value} = restProps;
      currentElement.props = {
        ...currentElement.props,
        [key]: value
      };
      console.log(id, restProps, state.components, 'state.components----');
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
