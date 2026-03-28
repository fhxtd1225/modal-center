<template>
  <Teleport to="body">
    <!-- 1. 全局静态遮罩层 -->
    <!-- 注意：这里不加 Transition，实现你要求的“即时”效果 -->
    <div
      v-if="store.activeModals.length > 0"
      class="global-modal-backdrop"
      @click="closeTopModal"
    ></div>

    <!-- 2. 弹窗层动画组 -->
    <!-- 使用 TransitionGroup 来处理列表项的进入和离开 -->
    <!-- <TransitionGroup name="modal-stack"> -->
    <TransitionGroup name="modal-stack" tag="div" class="modal-stack-root">
      <div v-for="(name, index) in store.activeModals" :key="name" class="modal-wrapper-layer">
        <!-- :style="{ zIndex: 2001 + index }" -->
        <!-- 阻止点击弹窗本体触发遮罩关闭 -->
        <div class="modal-inner-content" @click.stop>
          <component
            :is="modalMap[name]"
            :payload="store.payloadMap[name]"
            @close="(result) => store.close(name, result)"
            @success="(result) => store.triggerSuccess(name, result)"
          />
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { useModal } from './index'

const { store, modalMap } = useModal()

/**
 * 点击遮罩层时，关闭最顶层弹窗
 */
const closeTopModal = () => {
  if (store.activeModals.length > 0) {
    const topModalName = store.activeModals[store.activeModals.length - 1]
    store.close(topModalName)
  }
}
</script>

<style lang="scss" scoped>
/* 遮罩层 - 无动画，立即出现/消失 */
.global-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(31, 45, 42, 0.45);
  backdrop-filter: blur(4px);
  z-index: 2000;
}

/* 弹窗包装层 */
.modal-wrapper-layer {
  z-index: calc(var(--stack-index) + 1);
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  pointer-events: none; /* 穿透点击到遮罩 */
}

/* 弹窗内容区 */
.modal-inner-content {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  pointer-events: auto; /* 恢复弹窗内点击 */
  transition: all 0.3s ease; /* 层次切换时的平滑过渡 */
}

/* --- 动画核心逻辑 --- */

/* 进场动画：从下方升起 + 缩放回弹 */
.modal-stack-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 离场动画：向上轻微漂移 + 缩小消失 (更具轻盈感) */
.modal-stack-leave-active {
  position: absolute;
  inset: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.modal-stack-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(40px);
}

.modal-stack-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

/* 列表移动动画：当底层弹窗因为顶层弹窗关闭而需要调整样式时 */
.modal-stack-move {
  transition: all 0.3s ease;
}

/* 多层堆叠视觉效果：非顶层弹窗会被压低层级感 */
.modal-wrapper-layer:not(:last-child) {
  .modal-inner-content {
    filter: brightness(0.85) grayscale(0.2);
    transform: scale(0.94) translateY(-10px);
    opacity: 0.8;
  }
}

.modal-stack-root {
  position: fixed;
  inset: 0;
  z-index: 2001;
  pointer-events: none;
}
</style>
