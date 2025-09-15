<template>
    <el-container>
        <el-header>
            <f-header/>
        </el-header>
        <el-container>
            <!-- 让el-main里面的内容因为el-aside布局变化而变化 -->
           <el-aside :width="userStore.asideWidth">
                <f-menu/>
           </el-aside>
           <el-main>
            <f-tag-list/>
            <!-- 用于解构<router-view>提供的插槽属性 -->
            <router-view v-slot="{Component}">
                <!-- 用于缓存动态组件的实例，而不是销毁它们。当组件被切换时，<keep-alive> 会将
                组件实例存储在内存中，下次再次切换到该组件时，可以直接从缓存中恢复，而不需要重新
                初始化。max="10"里设置为 10，表示最多缓存 10 个组件实例。如果缓存的组件数量超过
                10 个，最早缓存的组件实例会被移除。<component> 被包裹在 <keep-alive> 中，因此
                它会被缓存起来，避免重复渲染 
                transition作用的组件里面只能有一个根节点，template标签的儿子元素只能有一个-->
                <!-- <component> 被包裹在 <keep-alive> 中，因此它会被缓存起来，避免重复渲染
                        动态绑定 is 属性的值为 Component，Component 是从 <router-view> 的插槽中
                        解构出来的当前路由匹配的组件对象 -->
                <transition name="fade">
                    <keep-alive :max="10">
                        <component :is="Component"></component>
                    </keep-alive>
                </transition>
            </router-view>
           </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
    import fHeader from './components/fHeader.vue';
    import FMenu from './components/FMenu.vue';
    import FTagList from './components/FTagList.vue';
    import { useUserStore } from '../store/user'
    const userStore = useUserStore()
</script>

<style>
/* 防止受el-aside动态宽度和transition一闪一闪的 */
    .el-aside {
        transition: all .2s;
    }
    /* 进入之前 */
    .fade-enter-from {
        opacity: 0;
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
    }
    /* 进入之后 */
    .fade-enter-to{
        opacity: 1;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
     /* 离开之前 */
    .fade-leave-from {
        opacity: 1;
    }
    /* 离开之后 */
    .fade-leave-to{
         opacity: 0;
        -webkit-transform: translate3d(0, 100%, 0);
        transform: translate3d(0, 100%, 0);
    }
    /* 过渡时长 */
    .fade-enter-active,
    .fade-leave-active{
        transition: all 0.3s;
    }
    /* 解决上一个导航页面还没离开，当前激活的导航页面内容就进来了，等离开了再进入 */
    .fade-enter-active {
        transition-delay: 0.3s;
    }
</style>