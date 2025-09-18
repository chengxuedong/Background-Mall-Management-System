import axios from "~/axios";
//优惠卷
export function getCouponList(page:number)
{
    return axios.get(`/admin/coupon/${page}`)
}

export function createCoupon(data:any) {
    return axios.post(`/admin/coupon`,data)
}
export function updateCoupon(id:number,data:any) {
    return axios.post(`/admin/coupon/${id}`,data)
}

export function deleteCoupon(id:number) {
    return axios.post(`/admin/coupon/${id}/delete`)
}

export function updateCouponStatus(id:number) {
    return axios.post(`/admin/coupon/${id}/update_status`, {
        status:0
    })
}