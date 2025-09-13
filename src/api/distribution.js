// 分销模块
import axios from "~/axios";
import { queryParams } from "../composables/util";

export function getAgentStatus()
{
    return axios.get(`/admin/agent/statistics`)
}

export function getAgentList(page, query = {})
{
    let r = queryParams(query)
    return axios.get(`/admin/agent/${page}${r}`)
}

export function getAgenOrdertList(page, query = {}) {
    let r = queryParams(query)
    return axios.get(`/admin/user_bill/${page}${r}`)
}

export function getConfig()
{
    return axios.get(`/admin/distribution_setting/get`);
}

export function setConfig(data) {
    return axios.post(`/admin/distribution_setting/set`,data);
}

