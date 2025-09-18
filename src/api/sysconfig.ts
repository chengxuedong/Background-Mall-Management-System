import axios from "~/axios";

export function getSysconfig()
{
    return axios.get(`/admin/sysconfig`);
}

export function setSysconfig(data:any) {
    return axios.post(`/admin/sysconfig`,data);
}

//在vite.config.json文件中已经用/api代替了域名
export const uploadAction = (import.meta as any).env.VITE_APP_BASE_API + "/admin/sysconfig/upload";