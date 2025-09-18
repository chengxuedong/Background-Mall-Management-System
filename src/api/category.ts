import axios from "~/axios";
// 商品分类列表
export function getCategoryList()
{
    return axios.get("/admin/category")
}

export function createCategory(data:any) {
    return axios.post(`/admin/category`,data)
}

export function updateCategory(id:number,data:any) {
    return axios.post(`/admin/category/${id}`,data)
}

export function updateCategoryStatus(id:number,status:number) {
    return axios.post(`/admin/category/${id}/update_status`,{status})
}

export function deleteCategory(id:number) {
    return axios.post(`/admin/category/${id}/delete`)
}

export function getCategoryGoods(id:number) {
    return axios.get(`/admin/app_category_item/list?category_id=${id}`)
}

export function deleteCategoryGoods(id:number) {
    return axios.post(`/admin/app_category_item/${id}/delete`)
}

export function connectCategoryGoods(data:any) {
    return axios.post(`/admin/app_category_item`,data)
}



