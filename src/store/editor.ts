import {v4 as uuidv4} from 'uuid';
import {Module} from 'vuex';
import store, {GlobalDataProps} from '.';
import {TextComponentProps, AllComponentProps} from '@/defaultProps';
import {textDefaultProps, imageDefaultProps} from 'lego-birks';
import {message} from 'ant-design-vue';
import {cloneDeep, update} from 'lodash-es';
import {insertAt} from '@/helper';
import {debounce} from '@/helper/index';

type MoveDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface EditorProps {
  // 供中间渲染的组件列表
  components: ComponentData[];
  // 当前使用的组件名称
  currentElement: string;
  // 当前组件的id
  currentId: string;
  page: PageData;
  // 当前被复制的组件
  copiedComponent?: ComponentData;
  // 记录操作过程中的历史数据
  histories: HistoryProps[];
  // 当前历史数据对应的index
  historyIndex: number;
  // 保存初始的数据，在回退的时候使用
  cachedOldValue: any;
  // 允许存储的历史记录的最大条数
  maxHistoryNumber: number,
}

export interface UpdateComponentData {
  key: keyof AllComponentProps | Array<keyof AllComponentProps>;
  value: string | string[];
  id: string;
  isRoot?: boolean;
}

export interface PageData {
  id?: number;
  props?: PageProps;
  title?: string;
  desc?: string;
  coverImg?: string;
  uuid?: string;
  setting?: {[key: string]: any};
  isTemplate?: boolean;
  isHot?: boolean;
  isNew?: boolean;
  author?: string;
  copiedCount?: number;
  status?: number;
  user?: {
    gender: string;
    nickName: string;
    picture: string;
    userName: string;
  };
}

export interface PageProps {
  backgroundColor: string;
  backgroundImage: string;
  backgroundRepeat: string;
  backgroundSize: string;
  height: string;
}

export interface HistoryProps {
  id: string;
  componentId: string;
  type: 'add' | 'delete' | 'modify';
  data: any;
  index?: number;
}

export type AllFormProps = AllComponentProps & PageProps;

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
      width: '100px',
      height: '100px',
      position: 'absolute',
      left: '20px',
      top: '10px',
      backgroundColor: '#ccc',
    },
  },
  // {
  //   id: uuidv4(),
  //   name: 'l-text',
  //   layerName: '图层2',
  //   isHidden: false,
  //   isLocked: false,
  //   props: {
  //     ...textDefaultProps,
  //     text: 'hello2',
  //     fontSize: '16px',
  //     fontWeight: 'bold',
  //     lineHeight: '2',
  //     fontFamily: 'FangSong',
  //   },
  // },
  // {
  //   id: uuidv4(),
  //   name: 'l-text',
  //   layerName: '图层3',
  //   isHidden: false,
  //   isLocked: false,
  //   props: {
  //     ...textDefaultProps,
  //     text: 'hello3',
  //     fontSize: '24px',
  //     backgroundColor: 'yellow',
  //     actionType: 'url',
  //     // url: 'http://baidu.com',
  //   },
  // },
  // {
  //   id: uuidv4(),
  //   name: 'l-image',
  //   layerName: '图层4',
  //   isHidden: false,
  //   isLocked: false,
  //   props: {
  //     ...imageDefaultProps,
  //     imageSrc:
  //       'https://static.imooc-lego.com/upload-files/%E5%A4%B4%E5%83%8F1-508783.png',
  //   },
  // },
];
const pageDefaultProps = {
  backgroundColor: '#ffffff',
  // backgroundImage:
  //   "url('https://static.imooc-lego.com/upload-files/screenshot-677311.png')",
  backgroundImage: '',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: '560px',
};

const modifyHistory = (
  state: EditorProps,
  history: HistoryProps,
  type: 'undo' | 'redo'
) => {
  const {data, componentId} = history;
  const {key, newValue, oldValue} = data;
  const newKey = key as
    | keyof AllComponentProps
    | Array<keyof AllComponentProps>;
  const updateComponent = store.getters.getElement(componentId);
  if (updateComponent) {
    // check key is Array
    if (Array.isArray(newKey)) {
      newKey.forEach((keyName, index) => {
        updateComponent.props[keyName] =
          type === 'undo' ? oldValue[index] : newValue[index];
      });
    } else {
      updateComponent.props[newKey] = type === 'undo' ? oldValue : newValue;
    }
  }
};

const pushHistory = (state: EditorProps, historyRecord: HistoryProps) => {
  // 对于处于回退操作中的历史记录，这个时候进行了操作
  // 需要将后续的历史记录清空，并将histtoryIndex置为初始状态
  if (state.historyIndex !== -1) {
    // if moved, delete all histories large then historyIndex
    state.histories = state.histories.slice(0, state.historyIndex);
    state.historyIndex = -1;
  }

  // larage then maxHistoryNumber
  // shift histories
  // push histories
  if (state.histories.length >= state.maxHistoryNumber) {
    state.histories.shift();
    state.histories.push(historyRecord);
  } else {
     state.histories.push(historyRecord);
  }
}

const pushModifyHistory = (
  state: EditorProps,
  data: {key: string; id: string; value: any}
) => {
  const { key, value, id } = data;
  pushHistory(state, {
    id: uuidv4(),
    componentId: id || state.currentId,
    type: 'modify',
    data: {
      oldValue: state.cachedOldValue,
      newValue: value,
      key,
    },
  });
  state.cachedOldValue = null;
};

const pushModifyHistoryDebounce = debounce(pushModifyHistory);
const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    currentId: '',
    page: {
      props: pageDefaultProps,
      title: 'test title',
    },
    histories: [],
    historyIndex: -1,
    cachedOldValue: null,
    maxHistoryNumber: 5,
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      component.layerName = '图层' + (state.components.length + 1);
      state.components.push(component);
      pushHistory(state, {
        id: uuidv4(),
        componentId: component.id,
        type: 'add',
        data: cloneDeep(component),
      });
    },
    deleteComponent(state, currId: string) {
      const currentComponent = store.getters.getElement(currId);
      const currentIndex = state.components.findIndex(
        (component) => component.id === currId
      );
      state.components = state.components.filter(
        (item: ComponentData) => item.id !== currId
      );
      pushHistory(state, {
        id: uuidv4(),
        componentId: currId,
        type: 'delete',
        data: currentComponent,
        index: currentIndex,
      });
      message.success('删除当前图层成功', 1);
    },
    updateComponent(state, {key, value, id, isRoot}: UpdateComponentData) {
      const currentElement = store.getters.getElement(id);
      if (currentElement) {
        if (isRoot) {
          (currentElement as any)[key as string] = value;
        } else {
          const oldValue = Array.isArray(key)
            ? key.map((k) => currentElement.props[k])
            : currentElement.props[key];
          if (!state.cachedOldValue) {
            state.cachedOldValue = oldValue;
          }
          pushModifyHistoryDebounce(state, {key, value, id}, oldValue);
          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach((keyName, index) => {
              currentElement.props[keyName] = value[index];
            });
          } else if (typeof key === 'string' && typeof value === 'string') {
            currentElement.props[key as keyof TextComponentProps] = value;
          }
        }
      }
    },
    setActive(state, currentId: string) {
      state.currentId = currentId;
    },
    updatePage(state, {key, value}) {
      state.page.props[key as keyof PageProps] = value;
    },
    // 历史记录向前
    undo(state) {
      // never undo before
      if (state.historyIndex === -1) {
        // undo the last item of array
        state.historyIndex = state.histories.length - 1;
      } else {
        state.historyIndex--; // 回退到上一级进行处理
      }
      // get the history record
      const history = state.histories[state.historyIndex];
      switch (history.type) {
        case 'add':
          // if create a component, back should delete this component
          state.components = state.components.filter(
            (component) => component.id !== history.componentId
          );
          break;
        case 'delete':
          // if delete a component, back should add this component in index;
          state.components = insertAt(
            state.components,
            history.index,
            history.data
          );
          break;
        case 'modify':
          // get the modify component, then write this oldValue
          modifyHistory(state, history, 'undo');
          break;
        default:
          break;
      }
    },
    // 历史记录向后
    redo(state) {
      if (state.historyIndex === -1) {
        return;
      }
      const history = state.histories[state.historyIndex];
      switch (history.type) {
        case 'add':
          // if add a component, forward should add this component
          state.components = insertAt(
            state.components,
            history.index,
            history.data
          );
          break;
        case 'delete':
          // if delete a component, forward should delete this component in index;
          state.components = state.components.filter(
            (component) => component.id !== history.componentId
          );
          break;
        case 'modify':
          // get the modify component, then write this newValue
          modifyHistory(state, history, 'redo');
          break;
        default:
          break;
      }
      state.historyIndex++;
    },
    copyComponent(state, id) {
      const currentComponent = store.getters.getElement(id);
      if (currentComponent) {
        state.copiedComponent = currentComponent;
        message.success('已拷贝当前图层', 1);
      }
    },
    pasteComponent(state) {
      if (state.copiedComponent) {
        const cloneComponent = cloneDeep(state.copiedComponent);
        cloneComponent.id = uuidv4();
        cloneComponent.layerName = cloneComponent.layerName + '副本';
        state.components.push(cloneComponent);
        message.success('已黏贴当前图层', 1);
        pushHistory(state, {
          id: uuidv4(),
          componentId: cloneComponent.id,
          type: 'add',
          data: cloneDeep(cloneComponent),
        });
      }
    },
    moveComponent(
      state,
      data: {direction: MoveDirection; amount: number; id: string}
    ) {
      const currentComponent = store.getters.getElement(data.id);
      if (currentComponent) {
        const oldTop = parseInt(currentComponent.props.top || 0);
        const oldLeft = parseInt(currentComponent.props.left || 0);
        const {direction, amount} = data;
        switch (direction) {
          case 'UP': {
            const newTop = oldTop - amount + 'px';
            store.commit('updateComponent', {
              key: 'top',
              value: newTop,
              id: data.id,
            });
            break;
          }
          case 'DOWN': {
            const newTop = oldTop + amount + 'px';
            store.commit('updateComponent', {
              key: 'top',
              value: newTop,
              id: data.id,
            });
            break;
          }
          case 'LEFT': {
            const newLeft = oldLeft - amount + 'px';
            store.commit('updateComponent', {
              key: 'left',
              value: newLeft,
              id: data.id,
            });
            break;
          }
          case 'RIGHT': {
            const newLeft = oldLeft + amount + 'px';
            store.commit('updateComponent', {
              key: 'left',
              value: newLeft,
              id: data.id,
            });
            break;
          }
          default: {
            break;
          }
        }
      }
    },
  },
  getters: {
    getCurrentComponent: (state) => {
      return state.components.find((item) => item.id === state.currentId);
    },
    getElement: (state) => (id: string) => {
      return state.components.find(
        (item) => item.id === (id || state.currentId)
      );
    },
    checkUndoDisabled: (state) => {
      // 1 no history item
      // 2 move to the first item
      if (state.histories.length === 0 || state.historyIndex === 0) {
        return true;
      }
      return false;
    },
    checkRedoDisabled: (state) => {
      // 1 no history item
      // 2 move to last item
      // 3 never undo before
      if (
        state.histories.length === 0 ||
        state.historyIndex === state.histories.length ||
        state.historyIndex === -1
      ) {
        return true;
      }
      return false;
    },
  },
};

export default editor;
