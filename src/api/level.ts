import axios from "~/axios";
//会员等级
export function getLevelList(page:number)
{
    return axios.get(`/admin/user_level/${page}`)
}

export function createLevel(data:any) {
    return axios.post(`/admin/user_level`,data)
}
export function updateLevel(id:number,data:any) {
    return axios.post(`/admin/user_level/${id}`,data)
}

export function updateLevelStatus(id:number,status:number) {
    return axios.post(`/admin/user_level/${id}/update_status`,{status})
}

export function deleteLevel(id:number) {
    return axios.post(`/admin/user_level/${id}/delete`)
}

