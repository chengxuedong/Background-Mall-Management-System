<template>
    <div class="f-header">
        <span class="logo">
            <el-icon class="mr-1"><ElemeFilled /></el-icon>
            帝莎编程
        </span>
        <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
            <Fold v-if="$store.state.asideWidth=='250px'"/>
            <Expand v-else/>
        </el-icon>
        <el-tooltip
            effect="dark"
            content="刷新"
            placement="bottom"
      >
        <el-icon class="icon-btn"@click="handleRefresh"><Refresh /></el-icon>
        </el-tooltip>
        <!-- 让处于最右边，用div包住 -->
         <!-- style:margin-left:auto; 占据所有可用的左侧空间，将元素尽可能地向右推-->
        <div class="ml-auto flex items-center" >
            <el-tooltip
            effect="dark"
            content="全屏"
            placement="bottom"
      >
            <el-icon class="icon-btn" @click="toggle">
                <FullScreen v-if="!isFullscreen"/>
                <Aim v-else/>
            </el-icon>
    </el-tooltip>
           
            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="flex items-center text-light-50">
                    <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
                    {{$store.state.user.username}}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <!-- command:点击菜单项会触发回调 -->
                    <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <form-drawer ref="formDrawerRef" title="修改密码" 
    destroyOnClose @submit="onSubmit">
    <!-- el-form标签包裹的内容将在form-drawer组件文件里面的<slot></slot>进去插槽 -->
          <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
                <el-form-item prop="oldpassword" label="旧密码">
                  <!-- 用插槽把单标签改成双标签,把插槽内容包起来 -->
                    <el-input v-model="form.oldpassword" placeholder="请输入旧密码">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" label="新密码">
                    <el-input type="password" v-model="form.password" show-password placeholder="请输入新密码">
                    </el-input>
                </el-form-item>
                <el-form-item prop="repassword" label="确认密码">
                    <el-input type="password" v-model="form.repassword" show-password placeholder="请输入确认密码">
                    </el-input>
                </el-form-item>
            </el-form>
    </form-drawer>
     
</template>
<script setup>
import { useLogout } from '../../composables/useManager';
import FormDrawer from '../../components/FormDrawer.vue';
import { useFullscreen } from '@vueuse/core'
import { useRepassword } from '../../composables/useManager';
// toggle进入全屏退出全屏切换状态
const { isFullscreen, toggle } = useFullscreen()
const {
        formDrawerRef,
        form,
        rules,
        formRef,
        onSubmit,
        openRePasswordForm
}=useRepassword();
const {
    handleLogout
}=useLogout()

const handleCommand = (c) => {
    switch (c)
    {
        case "logout":
            handleLogout();
            break;
        case "rePassword":
            openRePasswordForm();
            break;
    }
}

//刷新
const handleRefresh=() => location.reload();

</script>

<style>
    .f-header {
        @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
        height: 64px;
        z-index: 1000;
    }

    .logo {
        width: 250px;
        @apply flex justify-center items-center text-xl font-thin;
    }

    .icon-btn {
        @apply flex justify-center items-center;
        width: 42px;
        height: 64px;
        cursor: pointer;
    }

    .icon-btn:hover {
         @apply bg-indigo-600;
    }

    .f-header .dropdown {
        height: 64px;
        cursor: pointer;
        @apply flex justify-center items-center mx-5;
    }

    .dropdown>span:focus-visible {
    outline:none!important;
}
</style>