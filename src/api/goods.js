import axios from "~/axios";
import { queryParams } from "../composables/util";
//商品管理
//axios.post(请求地址,需要传的数据),返回一个promise

export function getGoodsList(page, query = {})
{
    let r = queryParams(query)
    //拼接后 ? tab=all&title=关键词&category_id=2&limit=10
    ///admin/goods/:page?tab=all&title=关键词&category_id=2&limit=10
    return axios.get(`/admin/goods/${page}${r}`)
}
//批量上架/下架
export function updateGoodsStatus(ids,status) {
    return axios.post(`/admin/goods/changestatus`,{ids,status})
}
export function createGoods(data) {
    return axios.post(`/admin/goods`,data)
}
export function updateGoods(id, data) {
    return axios.post(`/admin/goods/${id}`, data)
}
//批量删除
export function deleteGoods(ids) {
    return axios.post(`/admin/goods/delete_all`,{ids})
}

//读取商品信息
export function readGoods(id) {
    return axios.get(`/admin/goods/read/${id}`)
}

//设置轮播图，data是由图片链接组成的一维数组
export function setGoodsBanner(id,data) {
    return axios.post(`/admin/goods/banners/${id}`,data)
}

//更新商品规格
export function updateGoodsSkus(id,data) {
    return axios.post(`/admin/goods/updateskus/${id}`, data)
}

//添加商品规格选项
export function createGoodsSkusCard(data) {
    return axios.post(`/admin/goods_skus_card`, data)
}

//修改商品规格选项
export function updateGoodsSkusCard(id,data) {
    return axios.post(`/admin/goods_skus_card/${id}`, data)
}

//删除商品规格选项
export function deleteGoodsSkusCard(id) {
    return axios.post(`/admin/goods_skus_card/${id}/delete`)
}

//排序商品规格选项
export function sortGoodsSkusCard(data) {
    return axios.post(`/admin/goods_skus_card/sort`, data)
}

//添加商品规格选项值
export function createGoodsSkusCardValue(data) {
    return axios.post(`/admin/goods_skus_card_value`, data)
}

//修改商品规格选项值
export function updateGoodsSkusCardValue(id, data) {
    return axios.post(`/admin/goods_skus_card_value/${id}`, data)
} 

//删除商品规格选项值
export function deleteGoodsSkusCardValue(id) {
    return axios.post(`/admin/goods_skus_card_value/${id}/delete`)
} 

//选择设置商品规格选项和值
export function setGoodsSkusCardValue(id,data) {
    return axios.post(`/admin/goods_skus_card/${id}/set`, data)
}


//回收站批量恢复
export function restoreGoods(ids) {
    return axios.post(`/admin/goods/restore`,{ids})
}
// //回收站彻底删除
export function destoryGoods(ids) {
    return axios.post(`/admin/goods/destroy`, {ids})
}