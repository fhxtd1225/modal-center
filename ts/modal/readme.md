# 全局弹窗管理系统使用指南

该系统基于 Pinia 和 Vue3 动态组件实现，支持多层堆叠动画、类型安全检查以及集中化管理。

## 1. 定义弹窗 (Registry)

在 `modalRegistry.ts` 中注册你的组件。通过 `payload` 定义输入参数类型，`result` 定义返回结果类型。

```typescript
// modalRegistry.ts
import MyComponent from './MyComponent.vue'

export const modalRegistry = {
  // 键名即为弹窗名称
  myModal: { 
    component: MyComponent, 
    payload: {} as { id: number; title: string }, // 输入参数类型
    result: {} as { confirmed: boolean }          // 成功回调返回类型
  },
} as const
```

## 2. 初始化中心 (Initialization)

在 `modal.ts` 中创建实例并导出 Hook。

```typescript
// modal.ts
import { createModalCenter } from '~/infra/modal-center'
import { modalRegistry } from './modalRegistry'

export const modalCenter = createModalCenter(modalRegistry)

export const useModal = () => {
  const store = modalCenter.useModalStore()
  return {
    store,
    modalMap: modalCenter.modalMap,
    open: store.open,
    close: store.close
  }
}
```

## 3. 挂载宿主 (Setup)

在全局根组件（通常是 `App.vue`）中放置 `ModalHost`。

```vue
<!-- App.vue -->
<script setup>
import { ModalHost } from '~/infra/modal-center'
import { useModal } from '~/modal'
const { store, modalMap } = useModal()
</script>

<template>
  <div id="app">
    <router-view />
    
    <!-- 弹窗宿主，负责渲染和动画 -->
    <ModalHost :store="store" :modalMap="modalMap" />
  </div>
</template>
```

## 4. 调用弹窗 (Usage)

在业务代码中使用 `open` 方法。得益于 TypeScript，`payload` 和 `onSuccess` 的参数将会有完整的类型提示。

```typescript
import { useModal } from '~/modal'

const { open } = useModal()

const handleClick = () => {
  open('myModal', { id: 1, title: '测试弹窗' }, {
    onSuccess: (result) => {
      console.log('操作成功:', result.confirmed)
    },
    onClose: () => {
      console.log('弹窗已关闭')
    }
  })
}
```

## 5. 编写弹窗组件 (Component Design)

弹窗组件内部需遵循约定的 Props 和 Events。

```vue
<!-- MyComponent.vue -->
<script setup lang="ts">
const props = defineProps<{
  payload: { id: number; title: string } // 对应 Registry 中的 payload
}>()

const emit = defineEmits<{
  (e: 'success', result: { confirmed: boolean }): void // 对应 Registry 中的 result
  (e: 'close'): void
}>()

const handleConfirm = () => {
  emit('success', { confirmed: true }) // 调用后会自动触发 onSuccess 并关闭弹窗
}
</script>

<template>
  <div class="my-dialog">
    <h1>{{ payload.title }}</h1>
    <button @click="handleConfirm">确定</button>
    <button @click="$emit('close')">取消</button>
  </div>
</template>
```

## 功能特性

1.  **堆叠动画**：支持多个弹窗同时打开，底层弹窗会自动应用缩放、变暗的压低效果。
2.  **点击关闭**：点击半透明遮罩层默认关闭最顶层的弹窗。
3.  **类型安全**：调用 `open` 时，如果 `payload` 不匹配或弹窗名写错，编译器会直接报错。
4.  **即时遮罩**：遮罩层本身无进入动画，确保背景即时暗化，而弹窗内容具有平滑的升起回弹动画。
5.  **单例管理**：所有弹窗状态由 Pinia 统一维护，可随时通过 `store.closeAll()` 清空。