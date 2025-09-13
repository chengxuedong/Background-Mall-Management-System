<template>
    <div>
        <el-row :gutter="20" v-permission="['getStatistics1,GET']">
            <!-- 如果还没拿到后端数据赋值会加载骨架模型,这个时候panels.length=0,el-col不会显示-->
            <template v-if="panels.length==0">
                <el-col :span="6" v-for="i in 4" :key="i">
                    <el-skeleton style="width: 100%" animated loading>
                        <template #template>
                            <el-card shadow="hover" class="border-0">
                                <template #header>
                                    <div class="flex justify-between">
                                        <el-skeleton-item variant="text" style="width: 50%" />
                                        <!-- :type实现颜色变化属性 -->
                                        <el-skeleton-item variant="text" style="width: 10%" />
                                    </div>
                                </template>
                                <!-- 主要数据部分 -->
                                <el-skeleton-item variant="h3" style="width: 80%" />
                                <el-divider />
                                <div class="flex justify-between text-sm text-gray-500">
                                    <el-skeleton-item variant="text" style="width: 50%" />
                                    <el-skeleton-item variant="text" style="width: 10%" />
                                </div>
                            </el-card>
                        </template>
                    </el-skeleton>
                </el-col>
            </template>
            <el-col :span="6" :offset="0" v-for="(item, index) in panels" :key="index">
                <el-card shadow="hover" class="border-0">
                    <template #header>
                        <div class="flex justify-between">
                            <span class="text-sm">
                                {{ item.title }}
                            </span>
                            <!-- :type实现颜色变化属性 -->
                            <el-tag :type="item.unitColor||'primary'" effect="plain">
                                {{ item.unit }}
                            </el-tag>
                        </div>
                    </template>
                    <!-- 主要数据部分 -->
                    <span class="text-3xl font-bold text-gray-500">
                        <CountTo :value="item.value" />
                    </span>
                    <el-divider />
                    <div class="flex justify-between text-sm text-gray-500">
                        <span>{{ item.subTitle }}</span>
                        <span>{{ item.subValue }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <IndexNavs />
        <el-row :gutter="20" class="pt-5">
            <el-col :span="12" :offset="0">
                <!-- 拿v-permission和getInfo里面的ruleName对比，如果ruleName里面的数据不包含
                 v-permission里面的数据就不显示这个组件，因为不同身份权限不同 -->
                <IndexChart v-permission="['getStatistics3,GET']" />
            </el-col>
            <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
                <IndexCard title="店铺及商品提示" tip="店铺及商品提示" :btns="goods" class="mb-3" />
                <IndexCard title="交易提示" tip="需要立即处理的交易订单" :btns="order" />
            </el-col>
        </el-row>

    </div>
</template>
<script setup>
import { ref } from 'vue';
import IndexCard from '../components/indexCard.vue';
import IndexChart from '../components/indexChart.vue';
import IndexNavs from '../components/indexNavs.vue';
import CountTo from '../components/CountTo.vue';
import { getStatistics1, getStatistics2 } from '../api';
const panels = ref([])
getStatistics1()
    .then(res => {
        //拿到后端数据赋值
        panels.value = res.panels;

    })


const goods = ref([])
const order = ref([])
getStatistics2()
    .then(res => {  
        //拿到后端数据赋值
        goods.value = res.goods;
        order.value = res.order;
    })
</script>