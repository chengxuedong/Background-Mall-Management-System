<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <Search :modelValue="searchForm" @search="getData" @reset="resetSearchForm">
            <SearchItem label="关键词">
                <el-input v-model="searchForm.title" placeholder="商品标题" clearable>
                </el-input>
            </SearchItem>
        </Search>

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" default-expand-all>
            <el-table-column type="expand">
                <template #default="{row}">
                    <div class="flex pl-18">
                        <el-avatar :size="50" :src="row.user.avatar" fit="fill" class="mr-3"></el-avatar>
                        <div class="flex-1">
                            <h6 class="flex  items-center">
                                {{ row.user.nickname || row.user.username }}
                                <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
                                <!-- 如果评价框没有处于可编辑状态而且之前没有回复过 -->
                                <el-button size="small" class="ml-auto" @click="openTextarea(row)"
                                    v-if="!row.textareaEdit && !row.extra">回复</el-button>
                            </h6>
                            {{ row.review.data}}
                            <div class="py-2">
                                <el-image v-for="(url,index) in row.review.image" :key="index" :src="url" fit="fill"
                                    :lazy="true" style="width: 100px;height: 100px;" class="rounded"></el-image>
                            </div>
                            <div v-if="row.textareaEdit">
                                <el-input v-model="textarea" placeholder="请输入评价内容" clearable type="textarea"
                                    :rows="2"></el-input>
                                <div class="py-2">
                                    <el-button type="primary" size="small" @click="review(row)">回复</el-button>
                                    <el-button size="small" @click="row.textareaEdit=false">取消</el-button>
                                </div>
                            </div>
                            <template v-else>
                                <div class="mt-3 bg-gray-100 p-3 rounded" v-for="(item, index) in row.extra"
                                    :key="index">
                                    <h6 class="flex font-bold">
                                        客服
                                        <el-button type="info" size="small" class="ml-auto"
                                            @click="openTextarea(row,item.data)">修改</el-button>
                                    </h6>
                                    <p>{{ item.data }}</p>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="ID" width="70" align="center" prop="id">
            </el-table-column>
            <el-table-column label="商品" width="200">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-image :src="row.goods_item ? row.goods_item.cover : ''" fit="fill" :lazy="true"
                            style="width:50px;height:50px" class="rounded"></el-image>
                        <div class="ml-3">
                            <!-- ?用于在访问嵌套属性时避免报错。如果左侧的值是null或undefined,
                             它会直接返回undefined，而不会抛出错误。??它会在左侧的值为null或
                             undefined时,返回右侧的默认值。 
                             如果row.goods_item不存在，返回 undefined.
                             如果 row.goods_item?.title 是 null 或 undefined，返回 '商品已被删除'。-->
                            <h6>{{ row.goods_item?.title ?? '商品已被删除' }}</h6>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="评价信息" width="200">
                <template #default="{ row }">
                    <div>
                        <p>用户：{{ row.user.nickname || row.user.username }}</p>
                        <p>
                            <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
                        </p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="评价时间" width="180" align="center" prop="review_time">
            </el-table-column>
            <el-table-column label="状态">
                <template #default="{ row }">
                    <!--  $event可以拿到当前状态，row是当前对象-->
                    <!-- row.super==1  判断是不是超级管理员-->
                    <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                        @change="handleStatusChange($event, row)" :loading="row.statusLoading"
                        :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex items-center justify-center mt-5">
            <!-- 当前页发生改变的时候触发current-change重新获取数据 -->
            <el-pagination background layout="prev,pager,next" :total="total" :currentPage="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
    </el-card>
</template>

<script setup>
import { ref } from 'vue';
import {
    getGoodsCommentList,
    updateGoodsCommentStatus,
    reviewGoodsComment
} from '~/api/goods_comment';
import { useInitTable } from '~/composables/useCommon';
import Search from '~/components/search.vue';
import SearchItem from '~/components/searchItem.vue';
import { toast } from '~/composables/util';
const roles = ref([])

const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleStatusChange
} = useInitTable({
    searchForm: { title: "" },
    getList: getGoodsCommentList,
    //在封装js文件中通过onGetListSuccess(res)的方式把res传过来
    onGetListSuccess: (res) => {

        //res是getCommentList拿到的后端传过来的信息
        // 给每个对象加上一个statusLoading的状态,然后返回对象
        tableData.value = res.list.map(o => {
            o.statusLoading = false;
            //评价框是否处于编辑状态
            o.textareaEdit = false;
            return o
        });
        total.value = res.totalCount;
        roles.value = res.roles;
    },
    updateStatus: updateGoodsCommentStatus
});

const textarea = ref(null)

const openTextarea = (row,data=null) => {
    textarea.value =data;
    row.textareaEdit = true;
}

const review = (row) => {
    if (textarea.value == "")
        return toast("回复内容不能为空","error");

    reviewGoodsComment(row.id, textarea.value)
        .then(res => {
         row.textareaEdit =false;
            toast("回复成功");
            getData();
    })
}
</script>