<template>
  <div class="test-modal a-theme">
    <div class="header">
      <h3>测试弹窗 A</h3>
      <span class="badge">层级: {{ payload.depth }}</span>
    </div>
    
    <div class="content">
      <p>这是由 <b>{{ payload.from }}</b> 打开的第 {{ payload.depth }} 层弹窗。</p>
      <div class="actions">
        <button class="btn primary" @click="openNext">再开一个 B 弹窗</button>
        <button class="btn success" @click="$emit('success', { msg: 'A 完成了' })">成功并关闭</button>
        <button class="btn danger" @click="$emit('close')">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { modalCenter } from '~/infra/modal'

const props = defineProps<{
  payload: { depth: number; from: string }
}>()

const emit = defineEmits<{
  (e: 'success', result: { msg: string }): void
  (e: 'close'): void
}>()

const openNext = () => {
  modalCenter.open('testModalB', {
    depth: props.payload.depth + 1,
    from: '弹窗 A'
  })
}
</script>

<style scoped lang="scss">
.test-modal {
  padding: 30px;
  min-width: 400px;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  .badge {
    background: #e1f5fe;
    color: #01579b;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
  }

  .actions {
    margin-top: 30px;
    display: flex;
    gap: 12px;
  }

  .btn {
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    &.primary { background: #007bff; color: white; }
    &.success { background: #28a745; color: white; }
    &.danger { background: #dc3545; color: white; }
  }
}
</style>
