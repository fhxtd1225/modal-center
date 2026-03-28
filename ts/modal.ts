import { createModalCenter } from '~/infra/modal/createModalCenter'
import { modalRegistry } from './modalRegistry'

export const modalCenter = createModalCenter(modalRegistry)

// 导出方便使用的 hooks
export const useModal = () => {
  const store = modalCenter.useModalStore()
  return {
    store,
    modalMap: modalCenter.modalMap,
    open: store.open,
    close: store.close
  }
}
