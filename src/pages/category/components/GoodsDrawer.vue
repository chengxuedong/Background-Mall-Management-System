<!-- 推荐商品弹框 -->
<template>
    <FormDrawer ref="formDrawerRef" title="推荐商品" @submit="handleConnect" confirmText="关联">
        <el-table :data="tableData" border stripe style="width:100%">
            <el-table-column prop="goods_id" label="ID" width="60" />
            <el-table-column label="商品封面" width="180">
                <template #default="{row}">
                    <el-image :src="row.cover" fit="fill" :lazy="true" style="width: 64px;height: 64px;">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width="180" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-popconfirm title="是否要删除该关联商品？" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDelete(row)">
                        <template #reference>
                            <el-button type="primary" text size="small" :loading="row.loading">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </FormDrawer>
    <ChooseGoods ref="ChooseGoodsRef" />
</template>

<script setup>
import { ref } from 'vue';
import FormDrawer from '~/components/FormDrawer.vue';
import { getCategoryGoods, deleteCategoryGoods, connectCategoryGoods } from '~/api/category';
import { toast } from '~/composables/util';
import ChooseGoods from './ChooseGoods.vue';


const formDrawerRef = ref(null)
const category_id = ref(0)
const tableData = ref([])


const open = (item) => {
    category_id.value = item.id;
    item.GoodsDrawerLoading = true;
    getData()
    .then(res => formDrawerRef.value.open())
    .finally(() => {
        item.GoodsDrawerLoading = false;
    })
   
}

function getData() {
    return getCategoryGoods(category_id.value)
    .then(res => {
        tableData.value = res.map(o => {
            o.loading = false;
            return o;
        });
    })
}


const handleDelete = (row) => {
    deleteCategoryGoods(row.id)
        .then(res => {
            row.loading = true;
            toast("删除关联产品成功");
            getData();
        })
        // 不用设置这个因为当前对象已经被移除了
        // .finally(() => {
        //     row.loading = false;
        // })
}

const ChooseGoodsRef=ref(null)

const handleConnect = () => {
    ChooseGoodsRef.value.open((goods_ids) => {
        formDrawerRef.value.showLoading();
        connectCategoryGoods({
            category_id: category_id.value,
            goods_ids: goods_ids
        })
        .then(res => {
            getData();
            toast("关联成功");
        })
        .finally(() => {
            formDrawerRef.value.hideLoading();
        })
    });
}

defineExpose({
    open
})
</script>