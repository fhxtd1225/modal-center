import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Component } from 'vue'
import ModalHost from './ModalHost.vue'

export interface ModalDef<Payload = any, Result = any> {
  component: Component
  payload: Payload
  result: Result
}

export function createModalCenter<Registry extends Record<string, ModalDef>>(
  registry: Registry // ✅ 传值
) {

  type ModalName = keyof Registry
  type ModalPayload = { [K in ModalName]: Registry[K]['payload'] }
  type ModalResult = { [K in ModalName]: Registry[K]['result'] }

  // const modalMap: Record<ModalName, Component> = Object.fromEntries(
  //   Object.entries(registry).map(([name, def]) => [name, def.component])
  // ) as any

  const modalMap = Object.keys(registry).reduce((acc, name) => {
    acc[name as keyof typeof registry] = registry[name as keyof typeof registry].component
    return acc
  }, {} as Record<keyof typeof registry, Component>)
  
  const useModalStore = defineStore('ModalCenter', () => {
    const showMap = ref<Record<ModalName, boolean>>(
      Object.keys(modalMap).reduce((a, k) => ({ ...a, [k]: false }), {} as Record<ModalName, boolean>)
    )
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
      showMap.value[name] = true
      if (options?.onSuccess) successCallbacks[name] = options.onSuccess
      if (options?.onClose) closeCallbacks[name] = options.onClose
    }

    function close<K extends ModalName>(name: K, result?: ModalResult[K]) {
      showMap.value[name] = false
      closeCallbacks[name]?.(result)
    }

    function triggerSuccess<K extends ModalName>(name: K, result: ModalResult[K]) {
      successCallbacks[name]?.(result)
      close(name, result)
    }

    function closeAll() {
      (Object.keys(showMap.value) as ModalName[]).forEach(name => showMap.value[name] = false)
    }

    return { showMap, payloadMap, open, close, closeAll, triggerSuccess }
  })

  return {
    ModalHost,
    modalMap,
    useModalStore,
    types: {} as {
      ModalName: ModalName
      ModalPayload: ModalPayload
      ModalResult: ModalResult
    }
  }
}
