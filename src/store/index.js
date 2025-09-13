import { createStore } from 'vuex'
import { login, getinfo } from '../api/manager'
import { removeToken, setToken } from '../composables/auth'
const store = createStore({
    state() {
        return {
            //用户信息,默认空对象
            user: {},
            //侧边栏宽度
            asideWidth: "250px",
            menus: [],
            ruleNames: []
        }
    },
    mutations: {
        //mutations 是 Vuex 中唯一可以修改状态的地方。每个 mutation 都是一个函数，它接收 state 和额外的参数，用于更新状态。
        //Vuex 内部会追踪每次 mutation 的调用，包括什么时候调用的、修改了哪些状态等。这样，你就可以轻松地调试应用，查看状态是如何变化的。
        SET_USERINFO(state, user) {
            state.user = user
        },
        //展开/缩起侧边状态切换
        handleAsideWidth(state) {
            console.log("~~state.asideWidth=", state.asideWidth);
            state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px";
        },
        SET_MENUS(state, menus) {
            state.menus = menus;
        },
        SET_RULENAMES(state, ruleNames) {
            state.ruleNames = ruleNames;
        },
    },
    //用于处理业务逻辑和异步操作，不能直接修改状态，必须通过 commit 提交 mutation 来修改状态。
    actions: {
        //登录
        /*当你定义一个 action 时，Vuex 会自动将一个 context 对象作为第一个参数传递给 action。这个 context 对象包含了 commit、dispatch、state 等方法和属性。
        通过解构赋值 { commit }，你可以直接获取 commit 方法，用于提交 mutation来间接修改状态。*/
        login({ commit }, { username, password }) {
            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    setToken(res.token);
                    resolve(res);
                }).catch(err => reject(err))
            })
        },
        //获取当前用户信息
        getinfo({ commit }) {
            return new Promise((resolve, reject) => {
                getinfo().then(res => {
                    //将获取到的用户信息共享到其他页面和组件
                    //将用户信息赋值给vuex状态的user   
                    commit("SET_USERINFO", res);
                    commit("SET_MENUS", res.menus);
                    commit("SET_RULENAMES", res.ruleNames);
                    //resolve把拿到的信息传回
                    resolve(res);
                }).catch(err => reject(err))
            })
        },
        //退出登录
        //参数{xx}<=>解构xx
        logout({ commit }) {
            //移除cookie里的token
            removeToken();
            //清除当前用户状态vuex
            commit("SET_USERINFO", {})
        }
    }
})

export default store