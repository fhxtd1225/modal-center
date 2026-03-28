<template>
  <el-config-provider namespace="ep">
    <RouterView />
    <!-- 模态框 组件 -->
    <ModalHost :store="store" :modalMap="modalMap" />
  </el-config-provider>
</template>

<script lang="ts" setup>
/* 模态框 组件 */
import ModalHost from '~/infra/modal/ModalHost.vue'

</script>
