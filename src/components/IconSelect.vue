<template>
    <div class="flex items-center">
        <!-- 只有被选中才会显示-->
        <el-icon :size="20" class="mr-2" v-if="modelValue">
            <component :is="modelValue"></component>
        </el-icon>
        <!-- 当用户在下拉菜单中选择一个选项时，@change 事件会被触发，并调用 handleChange 方法。
             filterable打开搜索模式 -->
        <el-select filterable :modelValue="modelValue" placeholder="请选择图标" @change="handleChange">
            <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                <div class="flex justify-between items-center">
                    <el-icon>
                        <component :is="item"></component>
                    </el-icon>
                    <!-- item是图标名称 -->
                    <span class="text-gray-500">{{ item }}</span>
                </div>
            </el-option>
        </el-select>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import * as iconList from '@element-plus/icons-vue'  //引入所有图标
defineProps({
    modelValue: String
})
//拿到所有图标的name组成的数组
const icons = ref(Object.keys(iconList))
const emit = defineEmits(["update:modelValue"])
const handleChange = (icon) => {
    //icon是拿到的选中值
    // 使用 update:modelValue 作为事件名称，可以明确地表示这个事件是用于更新 v-model 的值。
    //icon 是用户选择的图标的名称，它是 el-option 的 value即modelValue=icon进行更新赋值
    emit("update:modelValue", icon);
}
</script>

<style>
.el-select__wrapper {
    width: 220px;
}
</style>