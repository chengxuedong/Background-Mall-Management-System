<!-- 菜单 -->
<template>
    <el-card shadow="never" class='border-0'>
        <ListHeader @refresh="getData" @create="handleCreate" />
        <!-- label：指定数据对象中用于显示节点名称的属性名，这里是 'name'。
        children：指定数据对象中用于表示子节点的属性名，这里是 'child'。
        这些配置告诉 el-tree 如何从 tableData 中提取节点名称和子节点数据。
        node-key指定每个节点的唯一标识。
        :default-expanded-keys设置默认展开的节点的 node-key 数组。
        -->
        <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" v-loading="loading" node-key="id"
            :default-expanded-keys="defaultExpandedKeys">
            <!-- #default 插槽用于自定义每个节点的显示内容。
             node：当前节点的节点对象，包含节点的状态信息（如是否展开、
             是否被选中等）。data：当前节点的数据对象，即 :data 属性
             中定义的每个节点的数据。
             `template` 插槽会覆盖默认渲染行为 
             默认情况(无插槽):el-tree自动使用`:props="{label:'name'}"`中的`label`字段(`name`)渲染节点内容。  
             添加插槽后：el-tree不再使用默认的`label`逻辑,完全依赖插槽内容。如果插槽为空(`{{}}`)，节点就会显示为空。 -->
            <template #default="{ node, data }">
                <!-- data是当前对象 -->
                <div class="custom-tree-node">
                    <el-tag size="small" :type="data.menu > 0 ? 'primary' : 'info'">
                        {{ data.menu ? "菜单" : "权限" }}
                    </el-tag>
                    <el-icon v-if="data.icon" :size="16" class="ml-2">
                        <component :is="data.icon"></component>
                    </el-icon>
                    <span>{{ data.name }}</span>
                    <!-- ml-auto推向最右边的前提父盒子得是flex定位 -->
                    <div class="ml-auto">
                        <el-switch v-model="data.status" :active-value="1" :inactive-value="0"
                            @change="handleStatusChange($event, data)">
                        </el-switch>
                        <!-- 阻止点击修改的时候冒泡使得菜单收起来和打开 -->
                        <el-button text type="primary" size="small" @click.stop="handleEdit(data)">修改</el-button>
                        <el-button text type="primary" size="small" @click.stop="addChild(data.id)">增加</el-button>
                        <el-popconfirm title="是否要删除该记录？" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleDelete(data.id)">
                            <template #reference>
                                <el-button type="primary" size="small" text @click="">
                                    删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </template>
        </el-tree>

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="上级菜单" prop="rule_id">
                    <!-- checkStrictly为true遵守父子节点互不关联，否则只有点击子节点才会变化
                        emitPath: false，只返回改变的节点id然后赋值给form.rule_id值而不是整个对象
                        props 属性用于定义如何从数据源中提取选中节点的值、标签和子节点等信息。
                       每个节点对象的id属性将被用作该节点的值。当用户选择某个节点时，form.rule_id 将被设置为该节点的 id 值。
                       label:指定显示文本-->
                    <el-cascader v-model="form.rule_id" :options="options" :props="{
                        value: 'id', label: 'name', children: 'child',
                        checkStrictly: true, emitPath: false
                    }" placeholder="请选择上级菜单" />
                </el-form-item>
                <el-form-item label="菜单/规则" prop="menu">
                    <el-radio-group v-model="form.menu">
                        <!-- 如果form.menu的值是1选中菜单是0选中规则 
                            当用户点击某个单选按钮时，form.menu 的值会被更新为该按钮的value。
                            :value动态绑定语法，表示value属性的值是从Vue的响应式数据中获取的。
                            如果你直接写 value="1"，Vue 会将其视为一个字符串 "1"，而不是数字 1。
                            这可能会导致类型不匹配的问题，比如在与 v-model 绑定的值是数字类型时。-->
                        <el-radio :value="1" border>菜单</el-radio>
                        <el-radio :value="0" border>规则</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="名称" style="width: 30%;"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
                    <IconSelect v-model="form.icon" />
                </el-form-item>
                <el-form-item label="前端路由" prop="frontpath" v-if="form.menu == 1 && form.rule_id > 0">
                    <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
                </el-form-item>
                <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
                    <el-input v-model="form.condition" placeholder="后端规则"></el-input>
                </el-form-item>
                <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
                    <el-select v-model="form.method" placeholder="请选择请求方式" class="m-2">
                        <el-option v-for="item in ['GET', 'POST', 'PUT', 'DELETE']" :key="item" :label="item"
                            :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000" />
                </el-form-item>

            </el-form>
        </FormDrawer>
    </el-card>
</template>

<script setup>
import { ref } from 'vue';
import ListHeader from '~/components/ListHeader.vue';
import { getRuleList, createRule, updateRule,updateRuleStatus,deleteRule } from '~/api/rule';
import { useInitTable, useInitForm } from '~/composables/useCommon';
import FormDrawer from '~/components/FormDrawer.vue';
import IconSelect from '~/components/IconSelect.vue';
const options = ref([])
const defaultExpandedKeys = ref([])
const {
    loading,
    tableData,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    getList: getRuleList,
    onGetListSuccess: (res) => {
        options.value = res.rules;
        tableData.value = res.list
        //生成一级菜单的id组成的数组赋值给它
        defaultExpandedKeys.value = res.list.map(o => o.id)
    },
    //把接口方法传递过去拿到修改菜单状态和删除菜单方法
    delete: deleteRule,
    updateStatus: updateRuleStatus
})


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
            rule_id: 0,
            menu: 0,
            name: "",
            condition: "",
            method: "GET",
            status: 1,
            order: 50,
            icon: "",
            frontpath: ""
        },
        rules: {

        },
        getData,
        update: updateRule,
        create: createRule
    }
)

//添加子分类
const addChild = (id) => {
    // handleCreate有重置方法所以后赋值
    handleCreate();
    form.rule_id = id;
    form.status = 1;
}
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

<style scoped>

</style>