import axios from "~/axios";
//imageMain相关接口
//获取图片列表
export function getImageList(id:number,page=1) {
    return axios.get(`/admin/image_class/${id}/image/${page}`);
}
export function updateImage(id:number,name:string) {
    return axios.post(`/admin/image/${id}`,{name});
}
export function deleteImage(ids:number[]) {
    return axios.post(`/admin/image/delete_all`,{ids});
}

export const uploadImageAction = (import.meta as any).env.VITE_APP_BASE_API + "/admin/image/upload";