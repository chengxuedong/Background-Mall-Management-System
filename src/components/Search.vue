<template>
    <el-form :model="modelValue" label-width="80px" class="mb-3" size="small">
        <el-row :gutter="20">
            <slot/>
            <template v-if="showSearch">
                <slot name="show"></slot>
            </template>
            <el-col :span="8" :offset="showSearch ? 0 : 8">
                <div class="flex items-center justify-end ">
                    <el-button type="primary" @click="$emit('search')">搜索</el-button>
                    <el-button @click="$emit('reset')">重置</el-button>
                    <el-button v-if="hasShowSearch" type="primary" text @click="showSearch = !showSearch">
                        {{ showSearch ? "收起" : "展开" }}
                        <el-icon class="ml-1">
                            <ArrowUp v-if="showSearch" />
                            <ArrowDown v-else />
                        </el-icon>
                    </el-button>
                </div>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, useSlots } from 'vue';
defineProps({
    modelValue:Object
})
defineEmits(["search","reset"])
const showSearch = ref(false)

const slots = useSlots();
//!!强行转化为boolean值，为true说明传过来的插槽内容有值
const hasShowSearch =ref(!!slots.show)
</script>