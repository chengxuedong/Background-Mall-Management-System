import axios from "~/axios";
import { queryParams } from "../composables/util";
//管理员
//axios.post(请求地址,需要传的数据),返回一个promise
export function login(username, password)
{
    return axios.post("/admin/login",{
            username,
            password
    })
}
//写接口方法
export function getinfo()
{
    return axios.post("/admin/getinfo")
}

//退出登录
export function logout() {
    return axios.post("/admin/logout")
}

//修改密码
export function updatepassword(data) {
    return axios.post("/admin/updatepassword",data)
}

export function getManagerList(page, query = {})
{
    let r = queryParams(query)
    //拼接后 ? limit = 10 & keyword=ceshi
    return axios.get(`/admin/manager/${page}${r}`)
}

export function updateManagerStatus(id,status) {
    return axios.post(`/admin/manager/${id}/update_status`,{status})
}
export function createManager(data) {
    return axios.post(`/admin/manager`,data)
}
export function updateManager(id, data) {
    return axios.post(`/admin/manager/${id}`, data)
}
export function deleteManager(id) {
    return axios.post(`/admin/manager/${id}/delete`)
}



