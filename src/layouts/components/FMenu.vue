<template>
    <div class="f-menu" :style="{width:userStore.asideWidth}">
        <!-- default-active默认激活菜单的index,当刷新前已经点开侧边栏的子菜单了，这个可以让刷新后保留激活菜单
             collapse是否水平折叠收起菜单（仅在 mode 为 vertical 时可用） 
             unique-opened 只能展开一个子菜单 collapse-transition动画效果-->
        <el-menu
        :default-active="defaultActive"
        unique-opened
        :collapse="isCollapse"
        default-active="2"
        class="border-0"
        @select="handleSelect"
        :collapse-transition="false"
      >
      <!--  :key=索引值(下标)为渲染的节点提供唯一标识-->
        <template v-for="(item,index) in asideMenus" :key="index">
            <!--  <el-sub-menu>需要唯一标识，这个唯一标识得属性名是index，值就是item.name -->
            <el-sub-menu v-if="item.child&&item.child.length>0"  :index="item.name">
                <template #title>
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{item.name}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item v-for="(item2,index2) in item.child" 
                :index="item2.frontpath" :key="index2">
                    <el-icon>
                        <component :is="item2.icon"></component>
                    </el-icon>
                    <span>{{item2.name}}</span>
                </el-menu-item>
            </el-sub-menu>
          <!-- 一级菜单 -->
            <el-menu-item v-else:index="item.frontpath" index="2">
                <el-icon>
                    <component :is="item.icon"></component>
                </el-icon>
                <span>{{item.name}}</span>
            </el-menu-item>
        </template>
      </el-menu>
    </div>
</template>
<script setup>
// 需要跳转用router
import { useRouter, useRoute,onBeforeRouteUpdate } from 'vue-router';
import { computed, ref } from 'vue';
import { useUserStore } from '../../store/user';
const router = useRouter();
const userStore = useUserStore();
const route = useRoute();
//默认选中
const defaultActive = ref(route.path);
//监听路由变化，解决点击标签导航侧边栏自动响应
onBeforeRouteUpdate((to,from) => {
    defaultActive.value = to.path;
})
//是否折叠
const isCollapse=computed(()=>!(userStore.asideWidth=="250px"))

const asideMenus = computed(() => userStore.menus)

const handleSelect = (e) => {
    router.push(e);
}
</script>
<style>
.f-menu {
    top: 64px;
    bottom:0;
    left: 0;
    /* 当超出高度可以滚动 */
    overflow-y: auto;
    overflow-x: hidden;
    transition: all .2s;
    @apply shadow-md fixed bg-light-50;
}
/* 隐藏滚动条 */
.f-menu::-webkit-scrollbar {
    width: 0;
}
</style>