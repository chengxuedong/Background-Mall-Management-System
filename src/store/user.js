import { ref } from 'vue'
import { defineStore } from 'pinia'
import { login as loginApi, getinfo as getinfoApi } from '../api/manager'
import { removeToken, setToken } from '../composables/auth'

// ref()<->state computed()<->getters function()<->actions
//pinia自动识别组合式写法为状态管理不用像vuex那样写mutations,state等
//命名规范：以 `use` 开头，以 `Store` 结尾

export const useUserStore = defineStore('user', () => {
    const user = ref({});
    const asideWidth = ref("250px");
    const menus = ref([]);//当前用户的菜单权限
    const ruleNames = ref([]);
  
    async function login({ username, password }) {
            try {
                const res = await loginApi(username, password)
                setToken(res.token)
                return res
            } catch (err) {
                throw err
            }
    }
    async function getinfo() {
        try {
                const res = await getinfoApi()
                user.value = res
                menus.value = res.menus
                ruleNames.value = res.ruleNames
                return res
            } catch (err) {
                throw err
            }
    }
    
    async function logout() {
            removeToken()
            this.user = {}
            this.menus = []
            this.ruleNames = []
    }
    
    function handleAsideWidth() {
            this.asideWidth = this.asideWidth === "250px" ? "64px" : "250px"
    }
    return { user, asideWidth, menus, ruleNames, login, getinfo, logout, handleAsideWidth }
})
