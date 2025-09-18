import axios from "~/axios";
import { queryParams } from "../composables/util";

//商品评论

export function getGoodsCommentList(page:number, query = {})
{
    let r = queryParams(query)
    //拼接后 ? limit = 10 & keyword=ceshi
    return axios.get(`/admin/goods_comment/${page}${r}`)
}

export function updateGoodsCommentStatus(id:number,status:number) {
    return axios.post(`/admin/goods_comment/${id}/update_status`,{status})
}
export function reviewGoodsComment(id:number,data:any) {
    return axios.post(`/admin/goods_comment/review/${id}`,{data})
}