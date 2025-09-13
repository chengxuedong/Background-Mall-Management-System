<template>
    <div>
        <Panel />
        <el-card shadow="never" class="border-0">
            <!-- 搜索 -->
            <Search :modelValue="searchForm" @search="getData" @reset="resetSearchForm">
                <SearchItem label="时间选择">
                    <el-radio-group v-model="searchForm.type">
                        <el-radio-button label="all">
                            全部
                        </el-radio-button>
                        <el-radio-button label="today">
                            今天
                        </el-radio-button>
                        <el-radio-button label="yesterday">
                            昨天
                        </el-radio-button>
                        <el-radio-button label="last7days">
                            最近7天
                        </el-radio-button>
                    </el-radio-group>
                </SearchItem>
                <template #show>
                    <SearchItem label="开始时间">
                        <el-date-picker v-model="searchForm.starttime" type="date" placeholder="开始日期"
                            style="width: 90%;" value-format="YYYY-MM-DD" />
                    </SearchItem>
                    <SearchItem label="结束时间">
                        <el-date-picker v-model="searchForm.endtime" type="date" placeholder="结束日期" style="width: 90%;"
                            value-format="YYYY-MM-DD" />
                    </SearchItem>
                    <SearchItem label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="关键词" clearable>
                        </el-input>
                    </SearchItem>
                    <!-- <SearchItem label="会员等级">
                        <el-select v-model="searchForm.user_level_id" placeholder="请选择会员等级" clearable>
                            <el-option v-for="item in user_level" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </SearchItem> -->
                </template>
            </Search>
            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
                <el-table-column label="ID" prop="id" align="center" />
                <el-table-column label="头像" width="65">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="40" :src="row.avatar">
                                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                            </el-avatar>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="用户信息" width="135">
                    <template #default="{ row }">
                        <div class="text-xs">
                            <p>用户: {{ row.username }}</p>
                            <p>昵称: {{ row.nickname }}</p>
                            <p>姓名: {{ row.user_info.name }}</p>
                            <p>电话: {{ row.phone }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="推广用户数量" prop="share_num" align="center" />
                <el-table-column label="订单数量" prop="share_order_num" align="center" />
                <el-table-column label="订单金额" prop="order_price" align="center" />
                <el-table-column label="账户佣金" prop="commission" align="center" />
                <el-table-column label="已提现金额" prop="cash_out_price" align="center" />
                <el-table-column label="提现次数" prop="cash_out_time" align="center" />
                <el-table-column label="未提现金额" prop="no_cash_out_price" align="center" />
                <el-table-column label="操作" fixed="right" align="center" width="180">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" text @click="openDataDrawer(row.id,'user')">
                            推广人
                        </el-button>
                        <el-button type="primary" size="small" text @click="openDataDrawer(row.id,'order')">
                            推广订单
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex items-center justify-center mt-5">
                <!-- 当前页发生改变的时候触发current-change重新获取数据 -->
                <el-pagination background layout="prev,pager,next" :total="total" :currentPage="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>
        </el-card>
        <dataDrawer ref="dataDrawerRef" />
        <dataDrawer ref="orderDataDrawerRef" type="order" />
    </div>
</template>

<script setup>
import Panel from './panel.vue';
import { ref } from 'vue';
import { getAgentList } from '~/api/distribution';
import { useInitTable } from '~/composables/useCommon';
import Search from '~/components/search.vue';
import SearchItem from '~/components/searchItem.vue';
import DataDrawer from './dataDrawer.vue';

const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData
} = useInitTable({
    searchForm: {
        keyword: "",
        type: "all",
        starttime: null,
        endtime: null
    },
    getList: getAgentList,
    //在封装js文件中通过onGetListSuccess(res)的方式把res传过来
    onGetListSuccess: (res) => {
        tableData.value = res.list;
        total.value = res.totalCount;
    }
});

const dataDrawerRef = ref(null);
const orderDataDrawerRef = ref(null);
const openDataDrawer = (id, type) => {
(type == 'user' ? dataDrawerRef:orderDataDrawerRef) .value.open(id);
}
</script>