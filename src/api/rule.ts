import axios from "~/axios";
//菜单
export function getRuleList(page:number, query = {})
{
    return axios.get(`/admin/rule/${page}`)
}

export function createRule(data:any) {
    return axios.post(`/admin/rule`,data)
}

export function updateRule(id:number,data:any) {
    return axios.post(`/admin/rule/${id}`,data)
}

export function updateRuleStatus(id:number,status:number) {
    return axios.post(`/admin/rule/${id}/update_status`,{status})
}

export function deleteRule(id:number) {
    return axios.post(`/admin/rule/${id}/delete`)
}

