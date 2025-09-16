import { ref } from 'vue'
import { useRoute,useRouter,onBeforeRouteUpdate } from 'vue-router'
import { useCookies } from "@vueuse/integrations/useCookies";

export function useTabList()
{
    const route = useRoute();
    const router = useRouter();
    const cookie = useCookies();
    const activeTab = ref(route.path)
    const tabList = ref([
        {
            title: '后台首页',
            path: "/"
        },
    ])


    const removeTab = (t) => {
        let tabs = tabList.value;
        let a = activeTab.value;
        // 如果删除的标签是当前激活的标签
        if (a == t) {
            tabs.forEach((tab, index) => {
                // 检查当前遍历到的标签路径是否与要删除的标签路径匹配。
                if (tab.path == t) {
                    const nextTab = tabs[index + 1] || tabs[index - 1];
                    if (nextTab) {
                        a = nextTab.path;
                    }
                }
            })
        }
        activeTab.value = a;
        tabList.value = tabList.value.filter(tab => tab.path != t)
        cookie.set("tabList", tabList.value);
    }

    //cookie 的使用是关键，用于在浏览器刷新后持久化标签列表的状态
    //初始化标签导航列表 刷新后不会恢复原状导致之前的选中都没了
    //如果浏览器中存储了标签列表的状态（通过 cookie），则将其恢复到页面中
    //使用 cookie 的 get 方法尝试从浏览器的 cookie 中获取名为 tabList 的数据。
    // cookie 是存储在浏览器中的键值对数据,用于在浏览器刷新或关闭后仍然保留数据
    function initTabList() {
        let tbs = cookie.get("tabList");
        if (tbs) {
            tabList.value = tbs;
        }
    }
    initTabList()

    //添加标签导航
    //使用 findIndex 方法检查当前标签列表 tabList.value 中是否已经存在路径为 tab.path 的标签
    const addTab = (tab) => {
        let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1;
        if (noTab) {
            tabList.value.push(tab);
        }
        cookie.set("tabList", tabList.value);
    }

    //选中激活的导航菜单项可以切换相应的页面
    const changeTab = (t) => {
        activeTab.value = t;
        router.push(t);
    }

    onBeforeRouteUpdate((to, from) => {
        activeTab.value = to.path;
        addTab({
            title: to.meta.title,
            path: to.path
        })
    })

    const handleClose = (c) => {
        if (c == "clearAll") {
            //切换回首页
            activeTab.value = "/";
            //过滤只剩下首页
            tabList.value = [{
                title: '后台首页',
                path: "/"
            }]
        } else if (c == "clearOther") {
            //过滤只剩下首页和当前激活
            tabList.value = tabList.value.filter(tab => tab.path == "/" || tab.path == activeTab.value)
        }
        cookie.set("tabList", tabList.value);
    }

    return {
        activeTab,
        tabList,
        changeTab,
        removeTab,
        handleClose
    }
}