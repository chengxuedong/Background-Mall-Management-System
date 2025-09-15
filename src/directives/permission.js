import { useUserStore } from "../store/user"

function hasPermission(value, el = false) {
    const userStore = useUserStore();
    // 如果传进来的value不是一个数组
    if (!Array.isArray(value)) {
        throw new Error(`需要配置权限,例如:v-permission="['getStatistics3, GET']"`)
    }
    //权限判断 Array.prototype.findIndex 方法检查 value 中的权限标识是否存在于 ruleNames 中
    //存在返回所在索引不存在返回-1
    const hasAuth = value.findIndex(v => userStore.ruleNames.includes(v)) != -1
    if (el && !hasAuth) {
        //确保在移除元素之前检查其父节点是否存在，避免潜在的错误。
        el.parentNode && el.parentNode.removeChild(el)
    }
    return hasAuth
}

export default {
    install(app) {
        app.directive("permission", {
            mounted(el, binding) {
                hasPermission(binding.value, el);
            }
        })

    }
}