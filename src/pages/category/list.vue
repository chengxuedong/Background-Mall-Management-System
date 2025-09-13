<!-- 菜单 -->
<template>
    <el-card shadow="never" class='border-0'>
        <ListHeader @refresh="getData" @create="handleCreate" />

        <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" v-loading="loading">
            <template #default="{ node, data }">
                <!-- data是当前对象 -->
                <div class="custom-tree-node">
                    <el-icon v-if="data.icon" :size="16" class="ml-2">
                        <component :is="data.icon"></component>
                    </el-icon>
                    <span>{{ data.name }}</span>
                    <!-- ml-auto推向最右边的前提父盒子得是flex定位 -->
                    <div class="ml-auto">
                        <el-button text type="primary" size="small" @click="openGoodsDrawer(data)"
                        :loading="data.GoodsDrawerLoading">推荐商品</el-button>
                        <el-switch v-model="data.status" :active-value="1" :inactive-value="0"
                            @change="handleStatusChange($event, data)">
                        </el-switch>
                        <!-- 阻止点击修改的时候冒泡使得菜单收起来和打开 -->
                        <el-button text type="primary" size="small" @click.stop="handleEdit(data)">修改</el-button>
                        <el-popconfirm title="是否要删除该商品分类？" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleDelete(data.id)">
                            <template #reference>
                                <el-button type="primary" size="small" text>
                                    删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </template>
        </el-tree>
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" label-width="80px" :inline="false">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" placeholder="分类名称"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
        <GoodsDrawer ref="GoodsDrawerRef" />
    </el-card>
</template>

<script setup>
import { ref } from 'vue';
import ListHeader from '~/components/ListHeader.vue';
import { getCategoryList, createCategory, updateCategory, updateCategoryStatus, deleteCategory } from '~/api/Category';
import { useInitTable, useInitForm } from '~/composables/useCommon';
import FormDrawer from '~/components/FormDrawer.vue';
import GoodsDrawer from './components/GoodsDrawer.vue';

const {
    loading,
    tableData,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    getList: getCategoryList,
    onGetListSuccess: (res) => {
        tableData.value = res.map(o => {
            o.GoodsDrawerLoading = false;
            return o;
        });
    },
    //把接口方法传递过去拿到修改菜单状态和删除菜单方法
    delete: deleteCategory,
    updateStatus: updateCategoryStatus
})


const {
    formDrawerRef,
    formRef,
    form,
    Categorys,
    drawerTitle,
    handleSubmit,
    handleCreate,
    handleEdit
} = useInitForm(
    {
        form: {
            name: ""
        },
        getData,
        update: updateCategory,
        create: createCategory
    }
)

const GoodsDrawerRef=ref(null)

const openGoodsDrawer = (row) => GoodsDrawerRef.value.open(row);
</script>

<style>
.el-form-item {
    display: flex;
    align-items: center;
}

.custom-tree-node {
    display: flex;
    align-items: center;
    flex: 1;
    font-size: 14px;
    padding-right: 8px;
}

.el-tree-node__content {
    padding: 20px 0;
}

.el-icon {
    margin-right: 5px;
}
</style>

<style scoped></style>