import axios from "~/axios";
//后台面板主控台
//写接口方法
//数据模型
export function getStatistics1()
{
    return axios.get("/admin/statistics1")
}
//IndexCard 
export function getStatistics2() {
    return axios.get("/admin/statistics2")
}
//IndexChart
export function getStatistics3(type) {
    return axios.get("/admin/statistics3?type="+type)
}