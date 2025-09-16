import axios from "~/axios";
//公告
export function getNoticeList(page:number, query = {})
{
    return axios.get(`/admin/notice/${page}`)
}

export function createNotice(data:any) {
    return axios.post(`/admin/notice`,data)
}
export function updateNotice(id:number,data:any) {
    return axios.post(`/admin/notice/${id}`,data)
}

export function deleteNotice(id:number) {
    return axios.post(`/admin/notice/${id}/delete`)
}