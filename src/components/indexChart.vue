<template>
    <el-card shadow="never">
        <template #header>
            <div class="flex justify-between">
                <span class="text-sm">
                    订单统计
                </span>
                <div>
                    <el-check-tag v-for="(item,index) in options" :key="index" :checked="current==item.value"
                        style="margin-right: 8px;" @click="handleChoose(item.value)">
                        {{item.text}}
                    </el-check-tag>
                </div>
            </div>
        </template>
        <!-- 设置了 id="chart" 和 ref="el"，用于挂载 ECharts 图表 -->
        <div ref="el" id="chart" style="width: 100%;height: 300px;"></div>
    </el-card>

</template>

<script setup>
import { ref,onMounted,onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getStatistics3 } from '../api/index';
import { useResizeObserver } from '@vueuse/core';
const current=ref("week")
const options = [{
    text: "近1个月",
    value:"month"
},
    {
        text: "近1周",
        value: "week"
    },
    {
        text: "近24小时",
        value: "hour"
    }]

const handleChoose = (type) => {
    //切换更新选中按钮
    current.value = type;
    //重新获取数据，切换相应的图表
    getData();
}

var myChart = null;
//页面渲染完
onMounted(() => {
    var chartDom = document.getElementById('chart');
    if (chartDom)
    {
        myChart = echarts.init(chartDom);
        getData();
    }

})

function getData()
{
    let option = {
        xAxis: {
            type: 'category',
            data: []
        },
        // y轴的数据类型
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar'
            }
        ]
    };

    myChart.showLoading();
    getStatistics3(current.value)
        .then(res => {
            option.xAxis.data = res.x;
            option.series[0].data = res.y;
            //更新图表配置
            myChart.setOption(option);
        }).finally(() => {
            myChart.hideLoading();
        })
    //在页面销毁之前，释放myChart对象，不然会出现白屏
    //正确的做法是，在图表容器被销毁之后，调用 echartsInstance.dispose 
    // 销毁实例，在图表容器重新被添加后再次调用 echarts.init 初始化。
onBeforeUnmount(() => {
    if (myChart)
    {
        echarts.dispose(myChart);
    }
})

}
const el = ref(null);
//监听页面大小变化
useResizeObserver(el, () => 
{
    //图表会等比例缩放
    if (myChart)
    myChart.resize()
}
)
</script>