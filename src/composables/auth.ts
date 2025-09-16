import { useCookies } from "@vueuse/integrations/useCookies";
const TokenKey = "admin-token"
const cookie = useCookies();
//使用cookie方法封装
//获取token
export function getToken()
{
    return cookie.get(TokenKey);
}

//设置token
export function setToken(token:string) {
    return cookie.set(TokenKey,token);
}

//移除token
export function removeToken() {
    return cookie.remove(TokenKey);
}