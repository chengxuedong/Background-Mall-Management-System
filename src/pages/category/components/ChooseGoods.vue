

<!-- 选择商品弹框 -->
<template>
    <el-dialog title="商品选择" 
    v-model="dialogVisible" width="80%" destroy-on-close>
        <el-table :data="tableData" ref="multipleTableRef" @selection-change="handleSelectionChange" stripe
            height="350px" style="width: 100%" v-loading="loading">
            <el-table-column type="selection" width="55" />
            <el-table-column label="商品">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-image class="mr-3 rounded" :src="row.cover" fit="fill" :lazy="true"
                            style="width: 50px;height: 50px;"></el-image>
                        <div class="flex-1">
                            <p>{{ row.title }}</p>
                            <div class="flex-col">
                                <span class="text-rose-500">￥{{ row.min_price }}</span>
                                <el-divider direction="vertical" />
                                <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
                            </div>
                            <p class="text-gray-400 text-xs mb-1">分类:{{ row.category ? row.category.name : "未分类" }}
                            </p>
                            <p class="text-gray-400 text-xs">创建时间:{{ row.create_time }}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="总库存" width="90" prop="stock" align="center">
            </el-table-column>
            <el-table-column label="价格(元)" align="center">
                <!-- row拿到当前对象 -->
                <template #default="{row}">
                    <span class="text-rose-500">￥{{ row.min_price }}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex items-center justify-center mt-5">
            <!-- 当前页发生改变的时候触发current-change重新获取数据 -->
            <el-pagination background layout="prev,pager,next" :total="total" :currentPage="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确认</el-button>
            </span>
        </template>
    </el-dialog>

</template>
<script setup>
import { ref } from 'vue';
import {
    getGoodsList
} from '~/api/goods';
import { useInitTable } from '~/composables/useCommon';

const {
    handleSelectionChange,
    multipleTableRef,
    searchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    multiSelectionIds//拿到选中id
} = useInitTable({
    searchForm: {
        title: "",
        tab: "all",// 默认选中的标签页
        category_id: null
    },
    getList: getGoodsList,
    //在封装js文件中通过onGetListSuccess(res)的方式把res传过来
    onGetListSuccess: (res) => {

        //res是getGoodsList拿到的后端传过来的信息
        // 给每个对象加上一个statusLoading的状态,然后返回对象
        tableData.value = res.list;
        total.value = res.totalCount;
    }
});

const dialogVisible = ref(false);

function close()
{
    dialogVisible.value = false;
}


const callbackFunction=ref(null)
const open = (callback = null) => {
    callbackFunction.value = callback;
    dialogVisible.value = true;
}

const submit = () => {
    if (typeof callbackFunction.value === "function")
    {
        console.log(2)
        // multiSelectionIds.value选中ID的一维数组,传回去
        callbackFunction.value(multiSelectionIds.value)
    }

    close();
}
defineExpose({
    open
})
</script>