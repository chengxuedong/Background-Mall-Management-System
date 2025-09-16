import { ref } from 'vue'
import { defineStore } from 'pinia'
import { login as loginApi, getinfo as getinfoApi } from '../api/manager'
import { removeToken, setToken } from '../composables/auth'

// ref()<->state computed()<->getters function()<->actions
//pinia自动识别组合式写法为状态管理不用像vuex那样写mutations,state等
//命名规范：以 `use` 开头，以 `Store` 结尾
//ts定义对象类型  ?:可选参数
export interface User {
    id: number;
    username: string;
    avatar: string;
    [key: string]: any;
}

export interface LoginForm {
    username: string;
    password: string;
}

export interface LoginRes {
    token: string;
}

export interface GetInfoRes {
    user: User;
    menus: MenuItem[];
    ruleNames: string[];
}

export interface MenuItem {
    id: number;
    name: string;
    desc: string;
    icon: string;
    child?: MenuItem[];
    [key: string]: any;
}
export const useUserStore = defineStore('user', () => {
    const user = ref<User>();
    const asideWidth = ref<"250px" | "64px">("250px");
    const menus = ref<MenuItem[]>([]);//当前用户的菜单权限
    const ruleNames = ref([]);
  
    async function login(form:LoginForm):Promise<LoginRes> {
            try {
                const res = await loginApi(form.username,form.password)
                setToken(res.token)
                return res
            } catch (err) {
                throw err
            }
    }
    async function getinfo():Promise<GetInfoRes> {
        try {
                const res = await getinfoApi()
                user.value = res.user
                menus.value = res.menus
                ruleNames.value = res.ruleNames
                return res
            } catch (err) {
                throw err
            }
    }
    
    async function logout():Promise<void> {
            removeToken()
            // this.user = {}
            // this.menus = []
            // this.ruleNames = []
    }
    
    function handleAsideWidth():void {
            asideWidth.value = asideWidth.value === "250px" ? "64px" : "250px"
    }
    return { user, asideWidth, menus, ruleNames, login, getinfo, logout, handleAsideWidth }
})
