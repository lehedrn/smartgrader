import { ref, onMounted, onUnmounted } from 'vue'

const DEVICE_MAP = {
  mobile: 768,
}

export function useDevice() {
  const device = ref('desktop')

  const isMobile = () => {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < DEVICE_MAP.mobile
  }

  const resizeHandler = () => {
    device.value = isMobile() ? 'mobile' : 'desktop'
  }

  onMounted(() => {
    resizeHandler()
    window.addEventListener('resize', resizeHandler)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler)
  })

  return {
    device,
  }
}
