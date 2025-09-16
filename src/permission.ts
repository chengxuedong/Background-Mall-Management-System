//权限相关
import { addRoutes, router } from './router'
import { getToken } from "./composables/auth";
import { toast, showFullLoading, hideFullLoading } from "./composables/util";
import {useUserStore} from "./store/user";
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

// const userStore = useUserStore();
//全局前置守卫
// to.path目标路径from.path当前路径
//反正重复性调用getInfo,导致页面加载慢
let hasGetInfo = false;
router.beforeEach(async (to:RouteLocationNormalized, from:RouteLocationNormalized, next:NavigationGuardNext) => {

    showFullLoading();

    const token: string | null = getToken();
    //拿到token,如果没有token就代表你之前是没有登录过的
    //没有登录过去的还不是登录页面,强制跳转登录页面
    if (!token && to.path != "/login") {
        toast("请先登录", "error");
        return next({ path: "/login" });
    }
    //防止重复登录(有token但还是要去登录界面)
    if (token && to.path == "/login") {
        toast("请勿重复登录", "error");
        return next({
            path: from.path ? from.path : "/"
        });
    }
    //解决获取到的用户信息刷新后没有了
    //如果用户登陆了，自动获取用户信息，存储在vuex的user当中
    //已经初始化的时候，ts可以自动识别类型
    let hasNewRoutes = false;
    if (token && !hasGetInfo) {
        const userStore = useUserStore();
        //因为resolve把拿到的信息传回这里
        let { menus } = await userStore.getinfo();
        hasGetInfo = true;
        //拿到token,动态添加路由
        hasNewRoutes = addRoutes(menus);

    }

    //设置页面标题
    let title: string = (to.meta.title ? to.meta.title : "") + "-商城后台管理系统"
    document.title = title;
    //如果有新的路由跳到指定路径，不然就普通的放行
    hasNewRoutes ? next(to.fullPath) : next();

})

//全局后置守卫  加载完页面关闭loading状态
router.afterEach((to:RouteLocationNormalized, from:RouteLocationNormalized) => hideFullLoading())

