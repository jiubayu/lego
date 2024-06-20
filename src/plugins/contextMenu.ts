import createContextMenu, { ActionItem } from "@/components/createContextmenu";
import {onMounted, onUnmounted} from 'vue';
import { useStore } from "vuex";

const initContextMenu = () => {
  const store = useStore();
  const testActions: ActionItem[] = [
    {
      shortcut: 'Backspace / Delete',
      text: '删除图层',
      action: (cid) => {
        console.log('撤销', cid);
        store.commit('deleteComponent', cid);
      },
    },
  ];
  let destroy = null;
  onMounted(() => {
    destroy = createContextMenu(testActions);
  })

  onUnmounted(() => {
    destroy && destroy();
  })
}

export default initContextMenu;