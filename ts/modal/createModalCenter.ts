import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Component } from 'vue'

export interface ModalDef<Payload = any, Result = any> {
  component: Component
  payload: Payload
  result: Result
}

export function createModalCenter<Registry extends Record<string, ModalDef>>(
  registry: Registry
) {
  type ModalName = keyof Registry
  type ModalPayload = { [K in ModalName]: Registry[K]['payload'] }
  type ModalResult = { [K in ModalName]: Registry[K]['result'] }

  const modalMap = Object.keys(registry).reduce((acc, name) => {
    acc[name as keyof typeof registry] = registry[name as keyof typeof registry].component
    return acc
  }, {} as Record<keyof typeof registry, Component>)

  const useModalStore = defineStore('ModalCenter', () => {
    // 使用数组记录开启顺序，实现堆叠
    const activeModals = ref<ModalName[]>([])
    const payloadMap = ref<Partial<ModalPayload>>({})

    const successCallbacks: Partial<{ [K in ModalName]: (result: ModalResult[K]) => void }> = {}
    const closeCallbacks: Partial<{ [K in ModalName]: (result?: ModalResult[K]) => void }> = {}

    function open<K extends ModalName>(
      name: K,
      payload: ModalPayload[K],
      options?: {
        onSuccess?: (result: ModalResult[K]) => void
        onClose?: (result?: ModalResult[K]) => void
      }
    ) {
      payloadMap.value[name] = payload
      
      // 如果已经在列表中，先移除再放入末尾（置顶）
      const index = activeModals.value.indexOf(name)
      if (index > -1) {
        activeModals.value.splice(index, 1)
      }
      activeModals.value.push(name)

      if (options?.onSuccess) successCallbacks[name] = options.onSuccess
      if (options?.onClose) closeCallbacks[name] = options.onClose
    }

    function close<K extends ModalName>(name: K, result?: ModalResult[K]) {
      const index = activeModals.value.indexOf(name)
      if (index > -1) {
        activeModals.value.splice(index, 1)
      }
      closeCallbacks[name]?.(result)
      // 清理回调
      delete successCallbacks[name]
      delete closeCallbacks[name]
    }

    function triggerSuccess<K extends ModalName>(name: K, result: ModalResult[K]) {
      successCallbacks[name]?.(result)
      close(name, result)
    }

    function closeTop() {
      if (activeModals.value.length > 0) {
        const topModalName = activeModals.value[activeModals.value.length - 1]
        close(topModalName)
      }
    }

    function closeAll() {
      activeModals.value = []
    }

    return { 
      activeModals, 
      payloadMap, 
      open, 
      close, 
      closeTop, 
      closeAll, 
      triggerSuccess 
    }
  })

  return {
    modalMap,
    useModalStore,
    types: {} as {
      ModalName: ModalName
      ModalPayload: ModalPayload
      ModalResult: ModalResult
    }
  }
}
