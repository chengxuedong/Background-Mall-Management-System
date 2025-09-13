import axios from "~/axios";
//规格管理
export function getSkusList(page)
{
    return axios.get(`/admin/skus/${page}`)
}

export function createSkus(data) {
    return axios.post(`/admin/skus`,data)
}
export function updateSkus(id,data) {
    return axios.post(`/admin/skus/${id}`,data)
}

export function updateSkusStatus(id,status) {
    return axios.post(`/admin/skus/${id}/update_status`,{status})
}
//单个删除or批量删除
export function deleteSkus(ids) {
    ids = !Array.isArray(ids) ? [ids] : ids;
    return axios.post(`/admin/skus/delete_all`,{ids})
}

