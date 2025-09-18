import { App, DirectiveBinding } from 'vue'
import { useUserStore } from "../store/user"

function hasPermission(value: unknown, el?: HTMLElement | false) {
    const userStore = useUserStore();
    if (!Array.isArray(value)) {
        throw new Error(`需要配置权限,例如:v-permission="['getStatistics3, GET']"`)
    }
    const ruleNames = (userStore.ruleNames as unknown as string[])
    const permissions = (value as string[])
    const hasAuth = permissions.findIndex((v: string) => ruleNames.includes(v)) != -1
    if (el && !hasAuth) {
        el.parentNode && el.parentNode.removeChild(el)
    }
    return hasAuth
}

export default {
    install(app: App) {
        app.directive("permission", {
            mounted(el: HTMLElement, binding: DirectiveBinding) {
                hasPermission(binding.value, el);
            }
        })
    }
}



