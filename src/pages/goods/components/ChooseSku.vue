<!-- 规格选择弹框 -->
<template>
    <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="5vh">
        <el-container style="height:65vh;">
            <el-aside class="image-aside" width="220px">
                <div class="top">
                    <div class="sku-list" v-for="(item, index) in tableData" :key="index"
                        @click="handleChangeActiveId(item.id)" 
                        :class="{'active':activeId==item.id}">
                    {{ item.name }}</div>
                </div>
                <div class="bottom">
                    <!-- 切换页码的时候触发current-change重新获取数据 -->
                    <el-pagination background layout="prev,next" :total="total" :currentPage="currentPage"
                        :page-size="limit" @current-change="getData" />
                </div>
            </el-aside>
            <el-main>
                <el-checkbox-group v-model="form.list">
                    <el-checkbox v-for="item in list" :key="item" :value="item" border>
                        {{item}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-main>
        </el-container>
        <template #footer>
            <span>
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </span>
        </template>
    </el-dialog>

</template>

<script setup>
import { reactive, ref } from 'vue';
import {
    getSkusList
} from "~/api/skus"
import { useInitTable } from '~/composables/useCommon';

const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
} = useInitTable({
    getList: getSkusList,
    //在封装js文件中通过onGetListSuccess(res)的方式把res传过来
    onGetListSuccess: (res) => {
        // res是getGoodsList拿到的后端传过来的信息
        // 给每个对象加上一个statusLoading的状态,然后返回对象
        tableData.value = res.list;
        total.value = res.totalCount;
        if (tableData.value.length > 0)
        {
            handleChangeActiveId(tableData.value[0].id);
        }
    }
    // delete: deleteGoods,
    // updateStatus: updateGoodsStatus
});

const dialogVisible = ref(false)
const activeId=ref(0)

const callbackFunction=ref(null)
const open = (callback = null) => {
    
    callbackFunction.value = callback;
    getData(1);
    dialogVisible.value = true;
}

const list = ref([])

const form = reactive({
    list:[]
})

function handleChangeActiveId(id){
    activeId.value = id;
    //清空原来的
    list.value = [];

    let item = tableData.value.find(o => o.id == id)
    if (item)
    {
        // defalut:"150,160,170"=>list.value=["150","160","170",]
        list.value=item.default.split(",")
        form.name = item.name;
    }
}

const submit = () => {
    if (typeof callbackFunction.value === "function")
    {
        callbackFunction.value(form)
    }
    dialogVisible.value = false;
}

defineExpose({
    open
})
</script>

<style>
.image-aside {
    border-right: 1px solid #eee;
    position: relative;
}

.sku-list {
    border-bottom: 1px solid #f4f4f4;
    @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
}

.sku-list:hover {
    @apply bg-blue-50;
}

.image-aside .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-aside .bottom {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0px;
    height: 50px;
    @apply flex items-center justify-center;
}


</style>