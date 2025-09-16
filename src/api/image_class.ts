import axios from "~/axios";
//imageAside相关接口
export function getImageClassList(page:number) {
    return axios.get("/admin/image_class/"+page);
}

export function createImageClass(data:any) {
    return axios.post("/admin/image_class" , data);
} 
export function updateImageClass(id:number,data:any) {
    return axios.post("/admin/image_class/"+id, data);
} 
export function deleteImageClass(id:number) {
    return axios.post(`/admin/image_class/${id}/delete`);
} 
