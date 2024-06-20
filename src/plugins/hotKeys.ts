import useHotKey from '@/hooks/useHotKey';
import {GlobalDataProps} from '@/store';
import { HotkeysEvent, KeyHandler } from 'hotkeys-js';
import {computed} from 'vue';
import { useStore } from 'vuex';

const wrap = (callback: KeyHandler) => {
  const wrapperFn = (e: KeyboardEvent, event: HotkeysEvent) => {
    e.preventDefault();
    callback(e, event);
  }
  return wrapperFn;
}

export default function initHotKeys() {
  const store = useStore<GlobalDataProps>();
  const currentId = computed(() => store.state.editor.currentId);
  useHotKey('crtl+c, command+c', () => {
    store.commit('copyComponent', currentId.value);
  });

  useHotKey('crtl+v, command+v', () => {
    store.commit('pasteComponent');
  });

  useHotKey('backspace, delete', () => {
    store.commit('deleteComponent', currentId.value);
  });

  useHotKey('esc', () => {
    store.commit('setActive', '');
  });

  useHotKey('up', wrap(() => {
    store.commit('moveComponent', {
      direction: 'UP',
      amount: 1,
      id: currentId.value,
    });
  }));
  useHotKey('down', wrap(() => {
    store.commit('moveComponent', {
      direction: 'DOWN',
      amount: 1,
      id: currentId.value,
    });
  }));
  useHotKey('Left', wrap(() => {
    store.commit('moveComponent', {
      direction: 'LEFT',
      amount: 1,
      id: currentId.value,
    });
  }));
  useHotKey('right', wrap(() => {
    store.commit('moveComponent', {
      direction: 'RIGHT',
      amount: 1,
      id: currentId.value,
    });
  }));
}
