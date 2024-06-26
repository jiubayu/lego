<template>
  <div class="edit-groups">
    <a-collapse v-model:activeKey="currentKey">
      <a-collapse-panel v-for="(item, index) in editGroups" :key="`item-${index}`" :header="item.text">
        <props-table :props="item.props" @change="handleChange"></props-table>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType, computed, ref} from 'vue';
import {AllComponentProps} from 'lego-birks';
import {difference} from 'lodash-es';
import PropsTable from './PropsTable.vue';
export interface GroupProps {
  text: string;
  items: string[];
}
const defaultEditGroups: GroupProps[] = [
  {
    text: '尺寸',
    items: [
      'height',
      'width',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
      'paddingBottom',
    ],
  },
  {
    text: '边框',
    items: ['borderStyle', 'borderColor', 'borderWidth', 'borderRadius'],
  },
  {
    text: '阴影与透明度',
    items: ['opacity', 'boxShadow'],
  },
  {
    text: '位置',
    items: ['left', 'top'],
  },
  {
    text: '事件功能',
    items: ['actionType', 'url'],
  },
];
export default defineComponent({
  components: {
    PropsTable,
  },
  props: {
    props: {
      type: Object as PropType<AllComponentProps>,
      required: true,
    },
    groups: {
      type: Array as PropType<GroupProps[]>,
      default: defaultEditGroups,
    },
    
  },
  emits:['change'],
  setup(props, context) {
    const currentKey = ref(['item-0']);
    const newGroups = computed(() => {
      const allNormalProps = props.groups.reduce((prev, curr) => {
        return [...prev, ...curr.items];
      }, [] as string[]);
      const specialProps = difference(Object.keys(props.props), allNormalProps);
      return [
        {
          text: '基本属性',
          items: specialProps,
        },
        ...props.groups,
      ];
    });
    const editGroups = computed(() => {
      return newGroups.value.map((group) => {
        const propsMap = {} as AllComponentProps;
        group.items.forEach((item) => {
          const key = item as keyof AllComponentProps;
          propsMap[key] = props.props[key];
        });
        return {
          ...group,
          props: propsMap,
        };
      });
    });
    const handleChange = (e:any) => {
      context.emit('change', e);
    }
    return {
      editGroups,
      currentKey,
      handleChange
    };
  },
});
</script>

<style lang="scss" scoped></style>
