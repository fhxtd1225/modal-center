import { createModalCenter } from './createModalCenter'
import { modalRegistry } from './modalRegistry'
import ModalHost from './ModalHost.vue'

// 初始化弹窗实例
const { useModalStore, modalMap } = createModalCenter(modalRegistry)

/**
 * 外部调用的 Hook
 */
export function useModal() {
  const store = useModalStore()
  
  return {
    store,
    modalMap,
    // 打开弹窗：modal.open('cart', { id: 1 })
    open: store.open,
    // 关闭弹窗：modal.close('cart')
    close: store.close,
    // 关闭所有
    closeAll: store.closeAll
  }
}

// 导出组件用于 App.vue 挂载
export { ModalHost }


