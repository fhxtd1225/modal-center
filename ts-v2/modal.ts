import { createModalCenter } from '~/infra/modal/createModalCenter'
import { modalRegistry } from './modalRegistry'

// export const modalCenter = createModalCenter(modalRegistry)

// // 导出方便使用的 hooks
// export const useModal = () => {
//   const store = modalCenter.useModalStore()
//   return {
//     store,
//     modalMap: modalCenter.modalMap,
//     open: store.open,
//     close: store.close
//   }
// }

/**
 * 兼容老架构导出
 * 现在你可以直接：
 * import { modalCenter } from '~/infra/modal'
 * modalCenter.open('goodEdit', { id: 123 })
 */
export const modalCenter = createModalCenter(modalRegistry)

// 如果还需要 Hook 形式，可以保留
export const useModal = () => {
  const store = modalCenter.useModalStore()
  return {
    store,
    modalMap: modalCenter.modalMap,
    open: store.open,
    close: store.close
  }
}
