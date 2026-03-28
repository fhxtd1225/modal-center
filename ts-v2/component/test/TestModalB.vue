<template>
  <div class="test-modal b-theme">
    <div class="header">
      <h3>测试弹窗 B</h3>
      <span class="badge">层级: {{ payload.depth }}</span>
    </div>
    
    <div class="content">
      <p style="color: #666;">来自: {{ payload.from }}</p>
      <div class="input-group">
        <input v-model="inputValue" placeholder="输入点什么..." />
      </div>
      
      <div class="actions">
        <button class="btn primary" @click="openNext">再开一个 A 弹窗</button>
        <button class="btn success" @click="handleSuccess">提交</button>
        <button class="btn" @click="$emit('close')">返回</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { modalCenter } from '~/infra/modal'

const props = defineProps<{
  payload: { depth: number; from: string }
}>()

const emit = defineEmits<{
  (e: 'success', result: { text: string }): void
  (e: 'close'): void
}>()

const inputValue = ref('')

const openNext = () => {
  modalCenter.open('testModalA', {
    depth: props.payload.depth + 1,
    from: '弹窗 B'
  })
}

const handleSuccess = () => {
  emit('success', { text: inputValue.value })
}
</script>

<style scoped lang="scss">
.test-modal {
  padding: 30px;
  min-width: 400px;
  background: #fff9f0;
  
  .header {
    border-bottom: 2px solid #ffd8a8;
    margin-bottom: 20px;
  }

  .input-group {
    margin: 20px 0;
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  }

  .actions {
    display: flex;
    gap: 10px;
  }

  .btn {
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
    &.primary { background: #ff922b; color: white; border-color: #ff922b; }
    &.success { background: #51cf66; color: white; border-color: #51cf66; }
  }
}
</style>
