<template>
  <component
    v-for="modal in activeModals"
    :key="modal.name"
    :is="modal.Comp"
    :payload="modal.payload"
    @close="(result) => close(modal.name, result)"
    @success="(result) => triggerSuccess(modal.name, result)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

/**
 * 完全与业务类型无关
 */

const props = defineProps<{
  store: {
    showMap: Record<string, boolean>
    payloadMap: Record<string, any>
    close: (name: string, result?: any) => void
    triggerSuccess: (name: string, result: any) => void
  }
  modalMap: Record<string, Component>
}>()

const { showMap, payloadMap, close, triggerSuccess } = props.store

const activeModals = computed(() =>
  Object.keys(showMap)
    .filter(name => showMap[name])
    .map(name => ({
      name,
      Comp: props.modalMap[name],
      payload: payloadMap[name]
    }))
)
</script>
