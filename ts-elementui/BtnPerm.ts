import { computed } from "vue";
import { useUserStore } from "../stores/module/user";



interface ButtonConfig {
  [key: string]: {
    api?: string; // 对应接口权限
    check?: () => boolean; // 可选业务逻辑
  };
}

/**
 * showButtons
 * @param config 按钮配置，key 对应模板 show.xxx
 */
export function useShowButtons(config: ButtonConfig) {
  return computed(() => {
    const result: Record<string, boolean> = {};
    for (const key in config) {
      const item = config[key];
      const permOk = item.api ? hasPermission(item.api) : true;
      const checkOk = item.check ? item.check() : true;
      result[key] = permOk && checkOk;
    }
    return result;
  });
}



export const hasPermission = (code: string) => {
  return useUserStore().perms.includes('*') ||
    useUserStore().perms.includes(code)
}


/**
 * 检查是否有权限 - 需要所有权限都具备
 * @param code 权限码数组
 * @returns 是否有所有权限
 */
// export const hasPermission = (code: string[]) => {
//   const perms = useUserStore().perms;

//   // 如果用户有超级权限(*)，则允许所有操作
//   if (perms.includes('*')) {
//     return true;
//   }

//   // 检查code数组中的每个权限是否都在用户的权限列表中
//   return code.every(permission => perms.includes(permission));
// };

// // permission judge function
// function hasPermission(perms: string[], permissions: string[]) {
//   if (perms.indexOf("*") >= 0) return true; // admin permission passed directly
//   if (!permissions) return true;
//   return permissions.every((perm: any) => perms.indexOf(perm) >= 0);
// }