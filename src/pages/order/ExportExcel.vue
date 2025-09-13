<template>
    <el-drawer title="导出订单" v-model="dialogVisible" size="40%">
        <el-form :model="form" label-width="80px"  >
            <el-form-item label="订单类型">
                <el-select v-model="form.tab" placeholder="请选择">
                    <el-option v-for="item in tabs" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
                <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="loading">导出</el-button>
            </el-form-item>
        </el-form>

    </el-drawer>
</template>

<script setup>
import { ref,reactive } from 'vue';
import { exportOrder } from '../../api/order';
import { toast } from '../../composables/util';
defineProps({
    tabs:Array
})

const dialogVisible = ref(false)


const open = () => dialogVisible.value = true;
const close = () => dialogVisible.value = false;
defineExpose({
    open
})

const form = reactive({
    tab: null,
    time: ""
})

const loading = ref(false);
const onSubmit = () => {
    if (!form.tab)
        return toast("订单类型不能为空", "error");
    loading.value = true;
    let starttime = null;
    let endtime = null;
    if(form.time&&Array.isArray(form.time))
    {
        starttime = form.time[0];
        endtime = form.time[1];
    }
    exportOrder({
        tab: form.tab,
        starttime: starttime,
        endtime: endtime,
    }).then(data => {
        // new Blob([data])创建一个 Blob 对象后，将data(后端返回的数据)封装为一个文件对象。
        //创建一个指向Blob对象的URL,可以被用作<a>标签的href属性,从而允许用户下载文件
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        //不需要被看到
        link.style.display = "none";
        link.href = url;
        // 获取当前时间的时间戳，并将其作为文件名，格式为 时间戳.xlsx。
        let filename = (new Date()).getTime() + '.xlsx';
        // 设置 < a > 标签的 download 属性，指定下载文件的名称。
        link.setAttribute("download",filename)
        document.body.appendChild(link);
        //手动模拟点击事件
        link.click();
        close();
    }).finally(() => {
        loading.value = false;
    })
}
</script>