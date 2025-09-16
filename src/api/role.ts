import axios from "~/axios";
//角色管理
export function getRoleList(page:number, query = {})
{
    return axios.get(`/admin/role/${page}`)
}

export function createRole(data:any) {
    return axios.post(`/admin/role`,data)
}
export function updateRole(id:number,data:any) {
    return axios.post(`/admin/role/${id}`,data)
}

export function updateRoleStatus(id:number,status:number) {
    return axios.post(`/admin/role/${id}/update_status`,{status})
}

export function deleteRole(id:number) {
    return axios.post(`/admin/role/${id}/delete`)
}

export function setRoleRules(id:number,rule_ids:number[]) {
    return axios.post(`/admin/role/set_rules`, {
        id, rule_ids
    })
}