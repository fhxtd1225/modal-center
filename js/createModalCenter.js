import { defineStore } from 'pinia'
import { ref, markRaw } from 'vue'

/**
 * 弹窗中心工厂函数
 * 模仿 TS 逻辑实现类型化的状态管理
 */
export function createModalCenter(registry) {
  // 提取组件映射表，并使用 markRaw 优化性能
  const modalMap = {}
  Object.keys(registry).forEach(name => {
    modalMap[name] = markRaw(registry[name].component)
  })

  const useModalStore = defineStore('ModalCenterStore', () => {
    // 当前激活的弹窗队列（支持多层弹窗叠加）
    const activeModals = ref([])
    // 存储每个弹窗对应的参数
    const payloadMap = ref({})
    
    // 存储成功和关闭的回调
    const successCallbacks = {}
    const closeCallbacks = {}

    /**
     * 打开弹窗
     * @param {string} name 注册名
     * @param {object} payload 传入参数
     * @param {object} options { onSuccess, onClose }
     */
    function open(name, payload = {}, options = {}) {
      if (!modalMap[name]) {
        console.error(`[ModalCenter] 弹窗 "${name}" 未注册`);
        return;
      }

      if (!activeModals.value.includes(name)) {
        activeModals.value.push(name)
      }
      
      payloadMap.value[name] = payload
      if (options.onSuccess) successCallbacks[name] = options.onSuccess
      if (options.onClose) closeCallbacks[name] = options.onClose
    }

    /**
     * 关闭弹窗
     * @param {string} name 注册名
     * @param {any} result 返回给 onClose 的结果
     */
    function close(name, result) {
      activeModals.value = activeModals.value.filter(n => n !== name)
      
      if (closeCallbacks[name]) {
        closeCallbacks[name](result)
      }

      // 清理引用防止内存泄漏
      delete payloadMap.value[name]
      delete successCallbacks[name]
      delete closeCallbacks[name]
    }

    /**
     * 触发成功回调并关闭
     * @param {string} name 注册名
     * @param {any} result 返回给 onSuccess 的结果
     */
    function triggerSuccess(name, result) {
      if (successCallbacks[name]) {
        successCallbacks[name](result)
      }
      close(name, result)
    }

    function closeAll() {
      activeModals.value = []
      payloadMap.value = {}
    }

    return { 
      activeModals, 
      payloadMap, 
      open, 
      close, 
      closeAll, 
      triggerSuccess 
    }
  })

  return {
    modalMap,
    useModalStore
  }
}
