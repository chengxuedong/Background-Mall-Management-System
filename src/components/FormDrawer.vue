<template>
   <el-drawer v-model="showDrawer" 
    :title="title"
    :size="size" 
    :close-on-click-modal="false"
    :destroy-on-close="destroyOnClose">
        <div class="formDrawer">
            <div class="body">
                <slot></slot>
            </div>
            <div class="actions">
              <el-button type="primary" @click="submit" :loading="loading">
                   {{confirmText}}
                  </el-button>
                    <el-button type="primary" @click="close">
                      取消
                    </el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue';
const showDrawer = ref(false);
//destroyOnClose控制是否在关闭 Drawer 之后将子元素全部销毁
const props = defineProps({
  title: String,
  size: {
    type: String,
    default:"45%"
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  }, confirmText: {
    type: String,
    default:"提交"
  }
})
const loading = ref(false);
const showLoading = () => loading.value = true;
const hideLoading = () => loading.value = false;
//打开
const open = () => showDrawer.value = true;
//关闭
const close = () => showDrawer.value = false;
//提交  对外暴露事件 点击提交按钮被触发，用emit可以通知父组件的@submit
const emit = defineEmits(["submit"])
const submit= ()=>emit("submit")
//向父组件暴露以下方法
defineExpose({
  open,
  close,
  showLoading,
  hideLoading
})
</script>

<style>
    /* .el-drawer__body {
      padding-bottom: 0;
    } */
    .formDrawer {
      width: 100%;
      height: 100%;
      position: relative;
      @apply flex flex-col;
    }

     .formDrawer .body {
      position: absolute;   
      top: 0;
      left: 0;
      bottom:50px;
      width: 100%;
      overflow-y: auto;
    }

    .formDrawer .actions {
      height: 50px;
      @apply mt-auto flex items-center
    }
</style>