import axios from "~/axios";
import { queryParams } from "../composables/util";
//订单列表

export function getOrderList(page:number, query = {})
{
    let r = queryParams(query)
    return axios.get(`/admin/order/${page}${r}`)
}


export function deleteOrder(ids:number[]) {
    return axios.post(`/admin/order/delete_all`,{ids})
}

export function refundOrder(id:number,data:any) {
    return axios.post(`/admin/order/${id}/handle_refund`, data)
}


export function exportOrder( query = {}) {
    let r = queryParams(query)
    return axios.post(`/admin/order/excelexport${r}`, {}, {
        responseType:"blob"
    })
}

export function getShipInfo(id:number) {
    return axios.get(`/admin/order/${id}/get_ship_info`)
}

