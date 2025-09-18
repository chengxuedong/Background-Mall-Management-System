// 用户管理

import axios from "~/axios";
import { queryParams } from "../composables/util";


export function getUserList(page:number, query = {})
{
    let r = queryParams(query)
    //拼接后 ? limit = 10 & keyword=ceshi
    return axios.get(`/admin/user/${page}${r}`)
}

export function updateUserStatus(id:number,status:number) {
    return axios.post(`/admin/user/${id}/update_status`,{status})
}
export function createUser(data:any) {
    return axios.post(`/admin/user`,data)
}
export function updateUser(id: number, data:any) {
    return axios.post(`/admin/user/${id}`, data)
}
export function deleteUser(id: number) {
    return axios.post(`/admin/user/${id}/delete`)
}



