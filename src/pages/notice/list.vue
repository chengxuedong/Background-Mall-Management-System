<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增|刷新 -->
        <ListHeader @create="handleCreate" @refresh="getData" />
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="title" label="公告标题"></el-table-column>
            <el-table-column prop="create_time" label="发布时间" width="380"></el-table-column>
            <el-table-column label="操作" align="center" width="180">
                <template #default="scope">
                    <!-- scope.row获取当前对象 -->
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">
                        修改
                    </el-button>
                    <el-popconfirm title="是否要删除该公告？" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" text @click="">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex items-center justify-center mt-5">
            <!-- 当前页发生改变的时候触发current-change重新获取数据 -->
            <el-pagination background layout="prev,pager,next" :total="total" :currentPage="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="form.title" placeholder="公告标题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input v-model="form.content" type="textarea" :rows=5 placeholder="公告内容"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>
<!-- /admin/notice/:page -->
<script setup>
import FormDrawer from '~/components/FormDrawer.vue';
import ListHeader from '../../components/ListHeader.vue';
import {
    getNoticeList,
    createNotice,
    updateNotice,
    deleteNotice
} from '../../api/notice';
import { useInitTable,useInitForm } from '../../composables/useCommon';

const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete
} = useInitTable({
    getList: getNoticeList,
    delete:deleteNotice
    });


const {
    formDrawerRef,
    formRef,
    form,
    rules,
    drawerTitle,
    handleSubmit,
    handleCreate,
    handleEdit
} = useInitForm(
    {
        form: {
            title: "",
            content: ""
        },
        rules: {
            title: [{
                required: true,
                message: '公告标题不能为空',
                trigger: 'blur'
            }],
            content: [{
                required: true,
                message: '公告内容不能为空',
                trigger: 'blur'
            }]
        },
        getData,
        update: updateNotice,
        create: createNotice
    }
)


</script>