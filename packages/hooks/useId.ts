import { type Ref, computed } from "vue";
// 默认ID注入
// 重置ID生成器：手动重置current为0，但会改变所有之前生成的ID
const defaultIdInjection = {
  prefix: Math.floor(Math.random() * 10000),// 随机生成四位数字，确保ID唯一
  current: 0,// 计数器
};
// 生成唯一Id
export function useId(namespace: string='melon'): Ref<string> {
  const idRef = computed(
    () =>
      `${namespace}-id-${defaultIdInjection.prefix}-${defaultIdInjection.current++}`
  );
  return idRef;
}
export default useId;
