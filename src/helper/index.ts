import { message } from 'ant-design-vue';
interface CheckCondition {
  format?: string[],
  // 使用多少M为单位
  size?: number,
}
type ErrorTypes = 'format' | 'size' | null;
export function beforeUploadedCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition;
  const isValidFormat = format ? format.includes(file.type) : true;
  const isValidSize = size ? file.size / 1024 / 1024 < size : true;
  let error: ErrorTypes = null;
  if (!isValidFormat) {
    error = 'format';
  }
  if (!isValidSize) {
    error = 'size';
  }
  return {
    passed: isValidFormat && isValidSize,
    error,
  }
}

export const commonUploadCheck = (file: File) => {
  const result = beforeUploadedCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 });
  const { passed, error } = result;
  if (error === 'format') {
    message.error('上传图片只能是 JPG/PNG 格式!');
  }
  if (error === 'size') {
     message.error('上传图片大小不能超过 1Mb');
  }
  return passed;
}

export const getElement = (element: HTMLElement, className: string) => {
  while (element) {
    if (element.classList && element.classList.contains(className)) {
      return element;
    } else {
      element = element.parentNode as HTMLElement;
    }
  }

  return null;
};

export const insertAt = (arr:any[], index:number, newItem: any) => {
  return [
    ...arr.slice(0, index),
    newItem,
    ...arr.slice(index),
  ]
}

// 防抖
export function debounce(fn: (...args:any) => void, delay: number = 1000) {
  let timer;
  return (...args:any) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }
}