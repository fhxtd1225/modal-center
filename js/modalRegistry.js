import { defineAsyncComponent } from 'vue'

/**
 * 弹窗组件注册表
 * 集中管理所有业务弹窗，支持异步加载
 */
export const modalRegistry = {
  // 购物车
  cart: {
    component: defineAsyncComponent(() => import('@/views/tips/cart.vue'))
  },
  // 结算页
  checkout: {
    component: defineAsyncComponent(() => import('@/views/tips/checkout.vue'))
  },
  // 地址列表
  addressList: {
    component: defineAsyncComponent(() => import('@/views/tips/addressList.vue'))
  },
  // 地址编辑
  addressEdit: {
    component: defineAsyncComponent(() => import('@/views/tips/addressEdit.vue'))
  },
  // 订单详情
  orderDetail: {
    component: defineAsyncComponent(() => import('@/views/tips/orderDetail.vue'))
  },
  // 商品列表购物车
  goodsListCart: {
    component: defineAsyncComponent(() => import('@/views/tips/goodsListCart.vue'))
  },
  // 用户资料
  // userInfo: {
  //   component: defineAsyncComponent(() => import('@/views/tips/userinfo.vue'))
  // }
}
