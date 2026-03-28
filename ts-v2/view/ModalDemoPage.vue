<template>
  <div class="demo-page">
    <h1>弹窗堆叠测试</h1>
    
    <div class="card">
      <p>当前活跃弹窗数: {{ store.activeModals.length }}</p>
      <div class="button-group">
        <button @click="startTest">开始测试 (打开第一个 A)</button>
        <button @click="modalCenter.closeAll()" class="btn-clear">全部清空</button>
      </div>
    </div>

    <div class="logs">
      <h4>操作日志:</h4>
      <ul>
        <li v-for="(log, i) in logs" :key="i">{{ log }}</li>
      </ul>
    </div>

    <!-- 挂载宿主，传入实例 -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { modalCenter } from '~/infra/modal'

const store = modalCenter.useModalStore()
const logs = ref<string[]>([])

const addLog = (msg: string) => {
  logs.value.unshift(`${new Date().toLocaleTimeString()} - ${msg}`)
}

const startTest = () => {
  modalCenter.open('testModalA', 
    { depth: 1, from: '主页面' },
    {
      onSuccess: (res) => addLog(`根弹窗 A 成功: ${res.msg}`),
      onClose: () => addLog('根弹窗 A 已关闭')
    }
  )
}
</script>

<style scoped>
.demo-page { padding: 40px; max-width: 800px; margin: 0 auto; }
.card { background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.button-group { display: flex; gap: 10px; margin-top: 10px; }
button { padding: 10px 20px; border-radius: 6px; border: 1px solid #007bff; background: #007bff; color: white; cursor: pointer; }
.btn-clear { background: #6c757d; border-color: #6c757d; }
.logs { background: #222; color: #00ff00; padding: 15px; border-radius: 8px; font-family: monospace; height: 200px; overflow-y: auto; }
</style>
