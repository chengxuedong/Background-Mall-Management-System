import { getToken } from "./composables/auth";
import axios from "axios";
import { toast } from './composables/util';
//在组件外部的普通JS文件中调用了useUserStore()，
// 但此时 Pinia 还没有被挂载到应用实例上,引发了报错
//解决办法：把useUserStore的调用放到拦截器里
import { useUserStore } from './store/user'
// const userStore = useUserStore();
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API//根域名，所有路径的前缀
});

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么(可以对请求头、请求参数等进行修改)
    //往header头自动添加token
    //拿到cookie值
    const token = getToken();
    if (token) {
        // 将变量 token 的值赋值给 config.headers 字典中键为 "token" 的字段。
        config.headers["token"] = token
    }
    //不需要再单独传参了，统一做处理有登录会自动帮我们传
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器,拦截所有通过service实例发送的请求的响应，并对响应数据进行统一处理，而不是每个接口都做某事
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么  如果请求类型是要导出下载数据的,返回response.data

    return response.request.responseType == "blob" ? response.data : response.data.data;
}, function (error) {
    const msg = error.response.data.msg || "请求失败";
    if (msg == "非法token，请先登录！") {
        const userStore = useUserStore();
        userStore.logout().finally(() => {
            location.reload();
        });
    }

    // 对响应错误统一做处理,而不是每个接口都
    toast(msg, "error");
    return Promise.reject(error);
});

export default service;