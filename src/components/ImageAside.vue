<template>
    <el-aside width="200px" class="image-aside" v-loading="loading">
        <div class="top">
            <!-- 监听 AsideList 组件发出的delete事件，调用 handledelete方法 -->
            <AsideList :active="activeId==item.id" v-for="(item,index) in list" :key="index" @edit="handleEdit(item)"
                @delete="handleDelete(item.id)" @click="handleChangeActiveId(item.id)">
                {{item.name}}
            </AsideList>
            <!-- active="active"<=>active -->
        </div>
        <div class="bottom">
            <!-- 当前页发生改变的时候触发current-change重新获取数据 -->
            <el-pagination background layout="prev,next" :total="total" :currentPage="currentPage" :page-size="limit"
                @current-change="getData" />
        </div>
    </el-aside>
    <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
            <!-- 使用prop来指定以下属于form数据对象的哪个字段 -->
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" :min="0" :max="1000" />
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';
import {
    getImageClassList,
    createImageClass,
    updateImageClass,
    deleteImageClass
} from '../api/image_class';
import AsideList from './AsideList.vue';
import FormDrawer from './FormDrawer.vue';
import { toast } from '../composables/util';
//加载动画
const loading = ref(false);
const list = ref([]);
const activeId = ref(0);
//分页部分
const currentPage = ref(1)
//总条数
const total = ref(0)
//每页限制显示几条
const limit = ref(10)

const editId = ref(0)
const formDrawerRef = ref(null)
const drawerTitle = computed(() => editId.value?"修改":"新增")
//获取数据
function getData(currentP=null)
{
    //有传当前页码
    if (typeof currentP == "number")
    {
        currentPage.value = currentP;
    }
    loading.value = true;
    getImageClassList(currentPage.value)
        .then(res => {
            total.value = res.totalCount;
            //刚开始进入图库页面默认选中第一个
            list.value = res.list;
            let item = list.value[0];
            if (item)
            {
                //获取完图库列表，加载相应的图库
                handleChangeActiveId(item.id);
            }
        })
        .finally(() => {
            loading.value = false;
    })
}

getData();

const form = reactive({
    name: "",
    order:50
})

const rules = {
    name: [{
        required: true,
        message: '图库分类名称不能为空',
        trigger: 'blur'
    }]
}

const formRef=ref(null)
const handleSubmit = () => {
    //点击提交后，调用validate方法对rules里面的验证规则进行验证表单元素
    formRef.value.validate((valid) => {
        // 验证没有通过返回
        if (!valid)
            return;
        formDrawerRef.value.showLoading();
        // editId 如果editId==0说明此时是添加,>0的话说明已经成功获取到了某一个AsideList的id,处于修改
        const fun = editId.value ? updateImageClass(editId.value,form):
            createImageClass(form)
        
            fun.then(res => {
                toast(drawerTitle.value+"成功");
                //如果是添加，重新获取第一页数据，因为一般加在第一页，是编辑的话，重新获取当前页的信息
                getData(editId.value?currentPage.value:1);
                formDrawerRef.value.close();
            }).finally(() => {
                formDrawerRef.value.hideLoading();
        })
        
    })

}
//编辑
const handleEdit = (row) => {
    editId.value = row.id;
    //在表单元素上自动填充相关信息
    form.name = row.name;
    form.order = row.order;
    formDrawerRef.value.open();
}
//新增
const handleCreate = () => {
    editId.value = 0;
    //如果点击过编辑按钮，原来的自动填充的信息会留在下一次打开，所以需要清空一下表单元素
    form.name = '';
    form.order = 50;
    formDrawerRef.value.open()
}

//删除
const handleDelete = (id) => {
    loading.value = true;
    deleteImageClass(id)
        .then(res => {
            toast("删除成功");
            getData();
        })
        .finally(() => {
            loading.value = false;
    })
}
//暴露change方法到父组件
const emit=defineEmits(["change"])
//切换选中分类
function handleChangeActiveId(id)
{
    activeId.value = id;
    //触发change，并把id传给父组件
    emit("change", id);
}
//调用handleCreate调用组件需要先暴露到父组件list.vue
//在组件上绑定ref属性，可以在父组件拿到子组件通过defineExpose暴露出去的方法
defineExpose({
    handleCreate
})
</script>
<style>
        .image-aside {
            border-right: 1px solid #eee;
            position: relative;
        }
    
        .image-aside .top{
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