<template>
    <div class="f-tag-list" :style="{left:$store.state.asideWidth}">
            <el-tabs
        v-model="activeTab"
        type="card"
        class="demo-tabs"
        @tab-remove="removeTab"
        @tab-change="changeTab"
        style="min-width: 100px;"
    >
    <!--  设置min-width: 100px;可以实现导航栏超出最小宽度的时候左右滑动
          el-tab-pane的唯一标识是name属性，用来绑定选中的tab-->
            <el-tab-pane
            v-for="item in tabList"
            :key="item.path"
            :label="item.title"
            :name="item.path"
            :closable="item.path!='/'"
            >
            </el-tab-pane>
        </el-tabs>
        <span class="tag-btn">
            <el-dropdown @command="handleClose">
                <span class="el-dropdown-link">
                <el-icon >
                    <arrow-down />
                </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="clearAll">关闭全部</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
    <!-- 占位置 -->
    <div style="height:44px;"></div>
</template>

<script setup>
import { useTabList } from '~/composables/useTabList';
const {
    activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose
} = useTabList();
</script>

<style>
    .f-tag-list {
        @apply fixed bg-gray-100 flex items-center px-2;
        top: 65px;
        right: 0;
        height: 60px;
        z-index: 100;
    }

    .tag-btn {
        @apply bg-white rounded ml-auto flex justify-center items-center px-2;
         height: 32px;
    }

    .el-tabs__header {
        margin: 0;
        border: 0!important;
    }   
    .el-tabs__nav,.el-tabs__nav{
        border: 0!important;
    } 
    .el-tabs__item{
        border: 0;
        height: 32px;
        @apply bg-white mx-1 rounded;
    } 
    .el-tabs__nav-prev,.el-tabs__nav-next{
        height: 32px;
        line-height: 32px;
    }

    .is-disabled {
        cursor: not-allowed;
        @apply text-gray-300;
    }

    .el-dropdown,.el-icon svg:focus,.el-icon,.el-dropdown-link {
        outline: 0!important;
    }
                 
</style>