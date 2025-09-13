// import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import Admin from '../layouts/admin.vue'
import Index from "~/pages/index.vue"//引入后台首页
import Login from "~/pages/login.vue"
import NotFound from "~/pages/404.vue"
import GoodsList from '../pages/goods/list.vue'
import CategoryList from '../pages/category/list.vue'
import UserList from '../pages/user/list.vue'
import OrderList from '../pages/order/list.vue'
import CommentList from '../pages/comment/list.vue'
import ImageList from '../pages/image/list.vue'
import NoticeList from '../pages/notice/list.vue'
import SettingBase from '../pages/setting/base.vue'
import CouponList from '../pages/coupon/list.vue'
import ManagerList from '../pages/manager/list.vue'
import AccessList from '../pages/access/list.vue'
import RoleList from '../pages/role/list.vue'
import SkusList from '../pages/skus/list.vue'
import LevelList from '../pages/level/list.vue'
import SettingBuy from '../pages/setting/buy.vue'
import SettingShip from '../pages/setting/ship.vue'
import DistributionIndex from '../pages/distribution/index.vue'
import DistributionSetting from '../pages/distribution/setting.vue'

//默认路由，所有用户共享，无论用户是否登录或具有何种权限，这些路由都对所有用户开放。
const routes = [{
    path: "/",
    // 添加嵌套路由要用到name
    name: "admin",
    component: Admin,
}, {
    path: "/login",
    component: Login,
    meta: {
        title: "登录页面"
    }
},
{
    path: '/:pathMatch(.*)*',//捕获所有未匹配的路径，显示 404 页面。
    name: 'NotFound',
    component: NotFound
}]

//子路由根据后端传进来的数据动态生成,用于匹配菜单动态添加路由
// asyncRoutes 是一个数组，通常包含所有异步路由的定义
const asyncRoutes = [{
    path: "/",
    name: "/",
    component: Index,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "后台首页"
    }
},
{
    path: "/goods/list",
    name: "/goods/list",
    component: GoodsList,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "商品管理"
    }
},
{
    path: "/category/list",
    name: "/category/list",
    component: CategoryList,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "分类列表"
    }
},
{
    path: "/user/list",
    name: "/user/list",
    component: UserList,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "用户列表"
    }
},
{
    path: "/order/list",
    name: "/order/list",
    component: OrderList,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "订单列表"
    }
},
{
    path: "/comment/list",
    name: "/comment/list",
    component: CommentList,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "评价列表"
    }
},
{
    path: "/image/list",
    name: "/image/list",
    component: ImageList,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "图库列表"
    }
},
{
    path: "/notice/list",
    name: "/notice/list",
    component: NoticeList,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "公告列表"
    }
},
{
    path: "/setting/base",
    name: "/setting/base",
    component: SettingBase,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "配置"
    }
},
{
    path: "/coupon/list",
    name: "/coupon/list",
    component: CouponList,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "优惠劵列表"
    }
},
{
    path: "/manager/list",
    name: "/manager/list",
    component: ManagerList,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "管理员管理"
    }
},
{
    path: "/access/list",
    name: "/access/list",
    component: AccessList,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "菜单权限管理"
    }
},
{
    path: "/role/list",
    name: "/role/list",
    component: RoleList,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "角色管理"
    }
},
{
    path: "/skus/list",
    name: "/skus/list",
    component: SkusList,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "规格管理"
    }
},
{
    path: "/level/list",
    name: "/level/list",
    component: LevelList,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "会员等级"
    }
},
{
    path: "/setting/buy",
    name: "/setting/buy",
    component: SettingBuy,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "支付配置"
    }
}, {
    path: "/setting/ship",
    name: "/setting/ship",
    component: SettingShip,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "物流配置"
    }
}, {
    path: "/distribution/index",
    name: "/distribution/index",
    component: DistributionIndex,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "分销员管理"
    }
}, {
    path: "/distribution/setting",
    name: "/distribution/setting",
    component: DistributionSetting,
    //页面跳转的时候更换相应的页面标题
    meta: {
        title: "分销设置"
    }
}]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

//动态添加路由的方法，放在创建router之后
//接收后端传过来的动态数组menus
export function addRoutes(menus) {
    console.log("~~menus=", menus);
    //是否有新的路由
    let hasNewRoutes = false;
    const findAndAddRoutesByMenus = (arr) => {
        console.log("~~arr=", arr);
        arr.forEach(e => {
            console.log("~~e=", e);
            // 使用 find 方法在 asyncRoutes 中查找路径 o.path
            // 与当前菜单项的 e.frontpath 匹配的路由对象 item
            //o是asyncRoutes数组中的一个对象和后端菜单传进来的路径(e.frontpath)是匹配的
            let item = asyncRoutes.find(o => o.path == e.frontpath)
            // 如果找到匹配的路由对象 item，并且当前路由系统中还没有这个路由(没有注册过)
            if (item && !router.hasRoute(item.name)) {
                //使用addRoute 方法将该路由添加到 admin 路由组中,添加嵌套路由
                router.addRoute("admin", item);
                hasNewRoutes = true;
            }

            //递归菜单层级，知道递归到头,没有子菜单了
            if (e.child && e.child.length > 0) {
                console.log("~~e.child=", e.child);
                findAndAddRoutesByMenus(e.child);
            }
        });
    }
    findAndAddRoutesByMenus(menus);
    //最后返回 hasNewRoutes，表示是否添加了新的路由
    console.log("~~hasNewRoutes=", hasNewRoutes);
    return hasNewRoutes;
}


