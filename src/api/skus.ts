import axios from "~/axios";
//规格管理
export function getSkusList(page:number)
{
    return axios.get(`/admin/skus/${page}`)
}

export function createSkus(data:any) {
    return axios.post(`/admin/skus`,data)
}
export function updateSkus(id:number,data:any) {
    return axios.post(`/admin/skus/${id}`,data)
}

export function updateSkusStatus(id:number,status:number) {
    return axios.post(`/admin/skus/${id}/update_status`,{status})
}
//单个删除or批量删除
export function deleteSkus(ids:number[]) {
    ids = !Array.isArray(ids) ? [ids] : ids;
    return axios.post(`/admin/skus/delete_all`,{ids})
}

