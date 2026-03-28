<template>
  <el-config-provider namespace="ep">
    <RouterView />
    <!-- 模态框 组件 -->
    <modalCenter.ModalHost :store="modalHostStore" :modalMap="modalCenter.modalMap" />
  </el-config-provider>
</template>

<script lang="ts" setup>
/* 模态框 组件 */
import { modalCenter } from './infra/modal';
const modalStore = modalCenter.useModalStore()
const modalHostStore = {
  showMap: modalStore.showMap,
  payloadMap: modalStore.payloadMap,
  close: (name: string, result?: any) => {
    modalStore.close(name as any, result)
  },
  triggerSuccess: (name: string, result: any) => {
    modalStore.triggerSuccess(name as any, result)
  }
}



onMounted(() => {
  // 获取当前页面的 URL
  const currentUrl = window.location.href;
  // 获取当前页面的 URL 参数
  const urlParams = new URLSearchParams(window.location.search);
  // 获取 URL 参数中的 token
  const token = urlParams.get('token');
  // ping();
})







</script>

<style lang="scss" scoped>
body {
  overflow: hidden;
}
</style>
