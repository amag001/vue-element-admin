// 对象的值的快速复制 不存在的key不复制 此时obj2有key但是没值,复制的是有key的值
export default async function objCoppy(obj1, obj2) {
  Object.keys(obj2).forEach(key => {
    obj2[key] = obj1[key]
  })
}
