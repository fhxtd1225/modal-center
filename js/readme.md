### 如何使用这个新系统？

1.  **在 `App.vue` 中挂载：**

    ```vue
    <template>
      <AppHeader />
      <router-view />
      <!-- 只需在这里放一个，它会自动根据 store 渲染弹窗 -->
      <ModalHost />
    </template>
    <script setup>
    import { ModalHost } from '@/modals'
    </script>
    ```

2.  **在任何页面打开弹窗：**

        ```javascript
        import { useModal } from '@/modals'
        const modal = useModal()

        // 打开购物车
        modal.open('cart')

        // 打开地址选择并监听回调
        modal.open(
          'addressList',
          { isCheckOut: true },
          {
            onSuccess: (data) => {
              console.log('用户选择了地址：', data.addressId)
            }
          }
        )
        ```



        ```javascript

    // 带回调
    modal.open( 'addressList', { isCheckOut: true }, { onSuccess: (data) => { form.addressId = data.addressId; handleRecalc(); } } )
        ```

3.  **在弹窗组件（如 `cart.vue`）中：**
    - 通过 `props.payload` 接收数据。
    - 通过 `emit('close')` 关闭。
    - 通过 `emit('success', data)` 传回成功结果并自动关闭。
