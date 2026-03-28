import { computed, toRaw } from 'vue'

/**
 * 安全的深拷贝函数
 * 优先使用 structuredClone，如果失败（如包含 Proxy 或不可克隆对象），
 * 则回退到 JSON 序列化（虽然会丢失 Date/Map 等特殊类型，但对表单数据通常足够且最安全）
 */
function safeClone<T>(val: T): T {
  try {
    // 先尝试剥离 Vue 的响应式外壳
    const raw = toRaw(val)
    return structuredClone(raw)
  } catch (e) {
    // 如果 structuredClone 依然失败（例如深层嵌套的 Proxy），使用 JSON 暴力深拷贝
    return JSON.parse(JSON.stringify(val))
  }
}

function getByPath(obj: any, path: string) {
  return path.split('.').reduce((o, k) => o?.[k], obj)
}

function setByPath(obj: any, path: string, value: any) {
  const keys = path.split('.')
  const last = keys.pop()!
  
  // 关键修复：先转为原始对象再克隆
  const clone = safeClone(obj)

  let cur = clone
  for (const k of keys) {
    cur[k] ??= {}
    cur = cur[k]
  }

  cur[last] = value
  return clone
}

type EmitFn<T> = (e: 'update:modelValue', v: T) => void

export function useFormModel<T extends Record<string, any>>(
  props: { modelValue: T },
  emit: EmitFn<T>
) {
  /** 只读表单数据 */
  const value = computed<T>(() => props.modelValue)

  /** 字段级 v-model（核心能力） */
  function field<P = any>(path: string) {
    return computed<P>({
      get: () => getByPath(value.value, path),
      set: (v) => {
        emit('update:modelValue', setByPath(value.value, path, v))
      }
    })
  }

  /** 设置单个字段（JS 使用） */
  function set(path: string, v: any) {
    emit('update:modelValue', setByPath(value.value, path, v))
  }

  /** 浅合并（推荐用于普通更新） */
  function patch(patchData: Partial<T>) {
    // 关键修复：确保 patch 的数据是深拷贝过的纯净数据
    // 并且基准数据 value.value 也要取 raw，虽然 emit 会自动处理 proxy，但为了逻辑统一
    emit('update:modelValue', {
      ...toRaw(value.value),
      ...safeClone(patchData)
    })
  }

  /** 整体替换（初始化 / 重置） */
  function replace(v: T) {
    emit('update:modelValue', safeClone(v))
  }

  return {
    value,   // 表单当前值（只读）
    field,   // v-model 专用
    set,     // 程序修改字段
    patch,   // 批量修改
    replace  // 整体替换
  }
}