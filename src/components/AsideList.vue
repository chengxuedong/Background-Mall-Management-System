<template>
    <div class="aside-list" :class="{'active':active}">
        <span class="truncate">
            <slot></slot>
        </span>
        <!-- .stop阻止往上冒泡 -->
        <el-button text type="primary" size="small" class="ml-auto px-1" @click="$emit('edit')">
            <el-icon :size="12">
                <Edit />
            </el-icon>
        </el-button>
        <!-- 使使用阻止冒泡的标签把那个删除的相关html代码包起来，阻止点击
         删除按钮的时候跳出消息弹框然后还同时加载点了删除按钮相应的右边的页面
         这样子把删除功能和加载右边内容的功能隔离开，点删除不会刷新加载-->
        <span @click.stop="() => {}">
            <el-popconfirm title="是否要删除该分类？" confirm-button-text="确认" cancel-button-text="取消"
                @confirm="$emit('delete')">
                <template #reference>
                    <el-button text type="primary" size="small" class="px-1">
                        <el-icon :size="12">
                            <Close />
                        </el-icon>
                    </el-button>
                </template>
            </el-popconfirm>
        </span>
    </div>
</template>
<script setup>
    defineProps({
    active: {
    type: Boolean,
    default:false
        }
    })
//先在子组件显式声明可以发出到父组件的事件，在子组件内部代码绑定事件
// 通过 $emit('delete') 触发 delete 事件，通知父组件进行删除操作
    defineEmits(["edit","delete"])
</script>
<style>
        .aside-list {
            border-bottom: 1px solid #f4f4f4;
            @apply flex items-center p-3 text-sm text-gray-600 cursor-pointer;
        }

        .aside-list:hover,
        .active {
            @apply bg-blue-50;
        }
</style>
