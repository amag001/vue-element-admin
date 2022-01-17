import http from '@/utils/request'
//获取角色列表
export async function getRoleListApi(parm){
  return await http.get("/api/role/list",parm)
}
//新增角色
export async function addRoleApi(parm){
  return await http.post("/api/role",parm)
}
//编辑角色
export async function editRoleApi(parm){
  return await http.put("/api/role",parm)
}
//删除角色
export async function deleteRoleApi(parm){
  return await http.delete("/api/role",parm)
}
//获取分配权限树数据
export async function getAssignTreeApi(parm){
  return await http.get("/api/role/getAssignPermissionTree",parm)
}
//分配权限保存
export async function assignSaveApi(parm){
  return await http.post("/api/role/roleAssignSave",parm)
}
