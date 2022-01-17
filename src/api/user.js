import http from '@/utils/request'

//登录
export async function login(parms){
  return await http.login("/api/user/login",parms);
}
//获取用户信息和权限信息
export async function getInfo(){
  return await http.get("/api/sysUser/getInfo")
}
export async function getMenuList(){
  return await http.get("/api/sysUser/getMenuList")
}
// //登录请求
// export function login(data) {
//   return request({
//     url: '/vue-element-admin/user/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo(token) {
//   return request({
//     url: '/vue-element-admin/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
// }
