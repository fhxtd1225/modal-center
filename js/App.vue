<template>
  <div class="app-wrapper">
    <AppHeader />

    <main class="app-body">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <Suspense>
            <template #default>
              <div class="page-content-host">
                <KeepAlive>
                  <component :is="Component" :key="$route.path" />
                </KeepAlive>
              </div>
            </template>
            <template #fallback>
              <div class="global-loader">
                <div class="spinner"></div>
                <p>探索文具世界中...</p>
              </div>
            </template>
          </Suspense>
        </Transition>
      </RouterView>
    </main>

    <AppFooter />

    <!-- 全局弹窗容器 -->
    <ModalHost />
    <BackToTop />
    <!-- <Loading /> -->
    <!-- 全局加载条 (用于常规 API 请求) -->
    <div v-if="uiStore.isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>{{ uiStore.loadingMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import BackToTop from '@/components/BackToTop.vue'
// import Loading from './components/Loading.vue'
import { ModalHost } from '@/modals'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'
import { getCatalog } from '@/api/api'
import { useCatgoryStore } from '@/stores/category'

const userStore = useUserStore()
const uiStore = useUIStore()
const categoryStore = useCatgoryStore()

onBeforeMount(async () => {
  userStore.autoLogin()
  try {
    const res = await getCatalog()
    if (res.data.errno === 0) {
      categoryStore.setRawCats(res.data.data)
    }
  } catch (e) {
    console.error('Initial data load failed', e)
  }
})
</script>

<style lang="scss">
@import './assets/main.scss';
@import './assets/base.scss';
@import './assets/css/iconfont.css';
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-main);
}

.app-body {
  flex: 1;
  width: 100%;
  margin: 0 auto;
}

.page-content-host {
  width: 100%;
}

/* 页面切换动画 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.3s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 加载样式 */
.global-loader,
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: var(--color-primary);
  font-weight: 500;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  z-index: 9999;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-bg-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
