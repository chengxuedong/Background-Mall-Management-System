<template>
    <div class="flex items-center justify-between mb-4 flex-1">
        <div>
            <el-button v-if="btns.includes('create')" type="primary" size="small" class="ml-2" @click="$emit('create')">
                新增
            </el-button>
            <el-popconfirm v-if="btns.includes('delete')" title="是否要删除选中记录？" confirm-button-text="确认"
                cancel-button-text="取消" @confirm="$emit('delete')">
                <template #reference>
                    <el-button type="danger" size="small">
                        批量删除
                    </el-button>
                </template>
            </el-popconfirm>
            <slot />
        </div>
        <div>
            <el-tooltip v-if="btns.includes('refresh')" effect="dark" content="刷新数据" placement="top">
                <el-button text @click="$emit('refresh')" size="small">
                    <el-icon :size="15">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip v-if="btns.includes('download')" effect="dark" content="导出数据" placement="top">
                <el-button text @click="$emit('download')" size="small">
                    <el-icon :size="15">
                        <Download />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const emit = defineEmits(
    ["create", "refresh", "delete","download"]
);

//批量删除用
const props=defineProps({
    layout: {
        type: String,
        default:"create,refresh"
    }
})
//转成数组
const btns = computed(() => props.layout.split(","))
</script>

<style>
    .el-button--small {
        padding: 12px 11px;
    }
</style>