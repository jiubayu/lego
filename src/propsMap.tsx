import { VNode, h } from 'vue'
// import { AllComponentProps } from 'lego-bricks'
// import { AllFormProps } from './store/editor'
// export type PropsToForms = {
//   [P in keyof AllFormProps]?: PropToForm
// }
const fontFamilyArr = [
  {label: '宋体', value: 'SimSun'},
  {label: '黑体', value: '"SimHei","STHeiti"'},
  {label: '楷体', value: '"KaiTi","STKaiti"'},
  {label: '仿宋', value: '"FangSong","STFangsong"'},
];
const fontFamilyOptions = fontFamilyArr.map(font => {
  return {
    value: font.value,
    label: <span style={{ fontFamily: font.value}}>{font.label}</span> as VNode
    // label: h('span', {fontFamily: font.value},font.label)
  }
})
// const defaultHandler = {
//   component: 'a-input',
//   eventName: 'change',
//   valueProp: 'value',
//   intialTransform: (v: any) => v,
//   afterTransform: (e: any) => e
// }
// const pxToNumberHandler: PropToForm = {
//   component: 'a-input-number',
//   initalTransform: (v: string) => v ? parseInt(v): 0,
//   afterTransform: (e: number) => e ? `${e}px` : '',
// }

// export const mapPropsToForms: PropsToForms = {
//   // textComponentProps
//   text: {
//     text: '文本',
//     component: 'a-textarea',
//     extraProps: { rows: 3 },
//     afterTransform: (e: any) => e.target.value,
//   },
//   fontSize: {
//     text: '字号',
//     ...pxToNumberHandler
//   },
//   lineHeight: {
//     text: '行高',
//     component: 'a-slider',
//     extraProps: { min: 0, max: 3, step: 0.1 },
//     initalTransform: (v: string) => parseFloat(v),
//     afterTransform: (e: number) => e.toString(),
//   },
//   textAlign: {
//     component: 'a-radio-group',
//     subComponent: 'a-radio-button',
//     text: '对齐',
//     options: [
//       { value: 'left', text: '左' },
//       { value: 'center', text: '中' },
//       { value: 'right', text: '右' }
//     ],
//     afterTransform: (e: any) => e.target.value,
//   },
//   fontFamily: {
//     component: 'a-select',
//     subComponent: 'a-select-option',
//     text: '字体',
//     options: [
//       { value: '', text: '无' },
//       ...fontFamilyOptions
//     ]
//   },
//   fontWeight: {
//     component: 'icon-switch',
//     initalTransform: (v: string) => v === 'bold',
//     afterTransform: (e: boolean) => e ? 'bold' : 'normal',
//     valueProp: 'checked',
//     extraProps: { iconName: 'BoldOutlined', tip: '加粗' }
//   },
//   fontStyle: {
//     component: 'icon-switch',
//     initalTransform: (v: string) => v === 'italic',
//     afterTransform: (e: boolean) => e ? 'italic' : 'normal',
//     valueProp: 'checked',
//     extraProps: { iconName: 'ItalicOutlined', tip: '斜体' }
//   },
//   textDecoration: {
//     component: 'icon-switch',
//     initalTransform: (v: string) => v === 'underline',
//     afterTransform: (e: boolean) => e ? 'underline' : 'none',
//     valueProp: 'checked',
//     extraProps: { iconName: 'UnderlineOutlined', tip: '下划线' }
//   },
//   color: {
//     component: 'color-picker',
//     text: '字体颜色'
//   },
//   backgroundColor: {
//     component: 'color-picker',
//     text: '背景颜色'
//   },
//   // imageComponentProps
//   src: {
//     component: 'image-processer'
//   },
//   // commonComponentProps - sizes
//   width: {
//     text: '宽度',
//     ...pxToNumberHandler
//   },
//   height: {
//     text: '高度',
//     ...pxToNumberHandler
//   },
//   paddingLeft: {
//     ...pxToNumberHandler,
//     text: '左边距'
//   },
//   paddingRight: {
//     ...pxToNumberHandler,
//     text: '右边距'
//   },
//   paddingTop: {
//     ...pxToNumberHandler,
//     text: '上边距'
//   },
//   paddingBottom: {
//     ...pxToNumberHandler,
//     text: '下边距'
//   },
//   // commonComponentProps - border type
//   borderStyle: {
//     ...defaultHandler,
//     component: 'a-select',
//     subComponent: 'a-select-option',
//     text: '边框类型',
//     options: [
//       { value: 'none', text: '无' },
//       { value: 'solid', text: '实线' },
//       { value: 'dashed', text: '破折线' },
//       { value: 'dotted', text: '点状线' }
//     ]
//   },
//   borderColor: {
//     ...defaultHandler,
//     component: 'color-picker',
//     text: '边框颜色'
//   },
//   borderWidth: {
//     ...pxToNumberHandler,
//     component: 'a-slider',
//     text: '边框宽度',
//     extraProps: { min: 0, max: 20 }
//   },
//   borderRadius: {
//     ...pxToNumberHandler,
//     component: 'a-slider',
//     text: '边框圆角',
//     extraProps: { min: 0, max: 200 }
//   },
//   // commonComponentProps - opacity and boxShadow
//   opacity: {
//     component: 'a-slider',
//     text: '透明度',
//     initalTransform: (v: number) => v ? v * 100 : 100,
//     afterTransform: (e: number) => (e / 100),
//     extraProps: { min: 0, max: 100, reverse: true }
//   },
//   boxShadow: {
//     component: 'shadow-picker'
//   },
//   // commonComponentProps - positions
//   left: {
//     ...pxToNumberHandler,
//     text: 'X轴坐标'
//   },
//   top: {
//     ...pxToNumberHandler,
//     text: 'Y轴坐标'
//   },
//   // commonComponentProps - actions and urls
//   // actions
//   actionType: {
//     ...defaultHandler,
//     component: 'a-select',
//     subComponent: 'a-select-option',
//     text: '点击',
//     options: [
//       { value: '', text: '无' },
//       { value: 'to', text: '跳转到 URL' }
//     ]
//   },
//   url: {
//     ...defaultHandler,
//     afterTransform: (e: any) => e.target.value,
//     text: '链接'
//   },
//   backgroundImage: {
//     ...defaultHandler,
//     component: 'background-processer',
//     initalTransform: (v: string) => {
//       if (v) {
//         const reg = /\(["'](.+)["']\)/g
//         const matches = reg.exec(v)
//         if (matches && matches.length > 1) {
//           console.log(matches)
//           return matches[1]
//         } else {
//           return ''
//         }
//       } else {
//         return ''
//       }
//     },
//     afterTransform: (e: string) => e ? `url('${e}')` : ''
//   },
// }

import { TextComponentProps } from './defaultProps';
export interface PropToForm {
  component: string;
  subComponent?: string;
  extraProps?: {[key: string]: any};
  text?: string;
  options?: {label: string|VNode; value: any}[];
  initalTransform?: (v: any) => any;
  afterTransform?: (v: any) => any;
  valueProp?: string;
  eventName?: string;
}
export type PropsToForms = {
  [P in keyof TextComponentProps]?: PropToForm;
};
export const mapPropsToForms: PropsToForms = {
  text: {
    text: '文本',
    component: 'a-textarea',
    extraProps: {
      rows: 2,
    },
    afterTransform: (e: any) => e.target.value,
  },
  fontSize: {
    text: '字号',
    component: 'a-input-number',
    initalTransform: (v: string) => (v ? parseInt(v) : 0),
    afterTransform: (v: number) => v + 'px',
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: {min: 0, max: 3, step: 0.1},
    initalTransform: (v: string) => (v ? parseInt(v) : 0),
    afterTransform: (v: number) => v.toString(),
  },
  textAlign: {
    text: '对齐',
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    options: [
      {label: '左', value: 'left'},
      {label: '中', value: 'center'},
      {label: '右', value: 'right'},
    ],
    afterTransform: (e: any) => e.target.value,
  },
  fontFamily: {
    text: '字体',
    component: 'a-select',
    subComponent: 'a-select-option',
    options: [{value: '', label: '无'}, ...fontFamilyOptions],
  },
  color: {
    text: '字体颜色',
    component: 'color-picker',
  },
};
