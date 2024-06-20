import { TextComponentProps } from "@/defaultProps";
import { mapPropsToForms } from "@/propsMap";
import { Input, InputNumber, Radio, Select, Slider } from "ant-design-vue";
import { reduce } from "lodash-es";
import { PropType, VNode, computed, defineComponent } from "vue";

const mapToComponent = {
  'a-textarea': Input.TextArea,
  'a-input-number': InputNumber,
  'a-slider': Slider,
  'a-radio-group': Radio.Group,
  'a-radio-button': Radio.Button,
  'a-select': Select,
  'a-select-option': Select.Option,
} as any; 
interface FormProps {
  component: string;
  subComponent?: string;
  value: string;
  extraProps?: {[key: string]: any};
  text?: string;
  options?: {text: string | VNode; value: any}[];
  valueProp?: string;
  eventName?: string;
  events: {[key: string]: (e: any) => void};
}

function capitializeFirstLetter(str: string) {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1); 
}

export default defineComponent({
  name: 'props-table',
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, context) {
    const finalProps = computed(() => {
      return reduce(
        props.props,
        (result, value, key) => {
          const newKey = key as keyof TextComponentProps;
          const item = mapPropsToForms[newKey];
          if (item) {
            const {
              valueProp = 'value',
              eventName = 'change',
              initalTransform,
            } = item;
            const newItem: FormProps = {
              ...item,
              valueProp,
              value: initalTransform ? initalTransform(value) : value,
              eventName,
              events: {
                ['on'+ capitializeFirstLetter(eventName)]: (e: any) =>
                  context.emit('change', {key, value: e}),
              },
            };
            result[newKey] = newItem;
          }
          return result;
        },
        {} as {[key: string]: FormProps}
      );
    });
    return () => (
      <div class="props-table">
        {
          Object.keys(finalProps.value).map((key, index) => {
            const value = finalProps.value[key];
            const ComponentName = mapToComponent[value.component];
            const SubComponent = value.subComponent
              ? mapToComponent[value.subComponent]
              : null;
            const props = {
              [value.valueProp]: value.value,
              ...value.extraProps,
              ...value.events,
            }
            return (
              <div key={key} class="prop-item">
                {value.text && <span class="label">{value.text}</span>}
                <div class="prop-component">
                  <ComponentName {...props}>
                    {
                      value.options && value.options.map((option, key: number) => {
                        return <SubComponent value={option.value}>{ option.text}</SubComponent>;
                      })
                    }
                  </ComponentName>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  },
});