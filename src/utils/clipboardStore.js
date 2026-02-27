import { ref } from 'vue'

const STORAGE_KEY = 'ue-stc-memetic-clipboard'

export const memeticClipboard = ref(JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]'))

export function addMemeticFragment(code, label) {
  if (!memeticClipboard.value.some(c => c.code === code)) {
    memeticClipboard.value.push({ code, label })
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memeticClipboard.value))
  }
}

export function clearMemeticClipboard() {
  memeticClipboard.value = []
  sessionStorage.removeItem(STORAGE_KEY)
}