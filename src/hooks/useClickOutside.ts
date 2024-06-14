import {onMounted, onUnmounted, ref, Ref } from 'vue';
const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  let isOutside = ref(false);
  const handler = (event: MouseEvent) => {
    if (elementRef.value && event.target) {
      if (elementRef.value.contains(event.target as HTMLElement)) {
        isOutside.value = false;
      } else {
        isOutside.value = true;
      }
    }
  }

  onMounted(() => {
    document.addEventListener('click', handler);
  })

  onUnmounted(() => {
    document.removeEventListener('click', handler);
  })

  return isOutside;
}

export default useClickOutside;