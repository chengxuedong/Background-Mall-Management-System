<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增|刷新 -->
        <ListHeader @create="handleCreate" @refresh="getData" />
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="角色名称"></el-table-column>
            <el-table-column prop="desc" label="角色描述" width="380"></el-table-column>
            <el-table-column label="状态" width="120">
                <template #default="{ row }">
                    <!--  $event可以拿到当前状态，row是当前对象-->
                    <!-- row.super==1  判断是不是超级管理员-->
                    <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                        @change="handleStatusChange($event, row)" :loading="row.statusLoading"
                        :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="250">
                <template #default="scope">
                    <!-- scope.row获取当前对象 -->
                    <el-button type="primary" size="small" text @click="openSetRule(scope.row)">
                        配置权限
                    </el-button>
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
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="form.desc" type="textarea" :rows=5 placeholder="角色描述"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>

        <!-- 权限配置 node-key和default-expanded-keys搭配用来默认打开一级菜单  show-checkbox提供多选框
         -->
        <FormDrawer ref="setRoleformDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
            <!-- 使用ref拿到节点 -->
            <el-tree-v2 ref="elTreeRef" node-key="id" :default-expanded-keys="defaultExpandedKeys" :data="ruleList"
                :props="{ label: 'name', children: 'child' }" show-checkbox :height="treeHeight"
                @check="handleTreeCheck" :check-strictly="checkStrictly">
                <template #default="{ node, data }">
                    <div class="flex items-center">
                        <el-tag :type="data.menu ? 'primary' : 'info'" size="small">
                            {{ data.menu ? "菜单" : "权限" }}
                        </el-tag>
                        <span class="ml-2 text-sm">
                            {{ data.name }}
                        </span>
                    </div>
                </template>
            </el-tree-v2>
        </FormDrawer>
    </el-card>
</template>
<!-- /admin/Role/:page -->
<script setup>
import { ref } from 'vue';
import FormDrawer from '~/components/FormDrawer.vue';
import ListHeader from '../../components/ListHeader.vue';
import {
    getRoleList,
    createRole,
    updateRole,
    deleteRole,
    updateRoleStatus,
    setRoleRules
} from '~/api/role';
import { useInitTable, useInitForm } from '~/composables/useCommon';
import { getRuleList } from '~/api/rule';
import { toast } from '../../composables/util';


const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    getList: getRoleList,
    delete: deleteRole,
    updateStatus: updateRoleStatus
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
            name: "",
            desc: "",
            status: 1
        },
        rules: {
            name: [{
                required: true,
                message: '角色名称不能为空',
                trigger: 'blur'
            }]
        },
        getData,
        update: updateRole,
        create: createRole
    }
)

const setRoleformDrawerRef = ref(null)
const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const defaultExpandedKeys = ref([])
const elTreeRef = ref(null)
//当前角色拥有的权限Id
const ruleIds = ref([])
const checkStrictly = ref(false)
//??????
const openSetRule = (row) => {
    roleId.value = row.id;
    treeHeight.value = window.innerHeight - 180;
    //在拿到数据之前先不关联，解决配置完之后父节点已选，原本配置的没选的子节点会再次被打开变成全部勾选了
    checkStrictly.value = true;
    //拿到第一页数据后再打开弹框
    getRuleList(1).then(res => {
        ruleList.value = res.list;
        //生成一级菜单的id组成的数组赋值给它
        defaultExpandedKeys.value = res.list.map(o => o.id)
        setRoleformDrawerRef.value.open();
        //在打开渲染完节点之后获取当前角色拥有的权限Id
        ruleIds.value = row.rules.map(o => o.id);
        setTimeout(() => {
            // 给节点开启自带的一个方法(选中拥有的权限)
            elTreeRef.value.setCheckedKeys(ruleIds.value);
        }, 50)
        setTimeout(() => {
            // //选中父节点，子节点都被选中
            checkStrictly.value = false;
        }, 150)
    })
}
const handleSetRuleSubmit = () => {
    setRoleformDrawerRef.value.showLoading();
    setRoleRules(roleId.value, ruleIds.value)
        .then(res => {
            toast("配置成功");
            getData();
            setRoleformDrawerRef.value.close();
        }
        ).finally(() => {
            setRoleformDrawerRef.value.hideLoading();
        })
}

const handleTreeCheck = (...e) => {
    const { checkedKeys, halfCheckedKeys } = e[1]
    //将完全选中和半选中的节点 ID 合并到 ruleIds 中。
    ruleIds.value = [...checkedKeys, ...halfCheckedKeys]

}

// 扩展运算符（...）可用于函数数组和对象
// 解构
// const [first, ...rest] = [1, 2, 3, 4];
// console.log(first); // 输出: 1
// console.log(rest);  // 输出: [2, 3, 4]
// 展开
// const array1 = [1, 2, 3];
// const array2 = [4, 5, 6];
// const newArray = [...array1, ...array2];
// console.log(newArray); // 输出: [1, 2, 3, 4, 5, 6]
// 函数参数的展开
// ...numbers 会将数组 numbers 中的每个元素展开为函数的参数。这些参数会被传递给函数 sum。
// function sum(a, b, c) {
//     return a + b + c;
// }
// const numbers = [1, 2, 3];
// const result = sum(...numbers);
// console.log(result); // 输出: 6
// 复制对象
// const obj = { a: 1, b: 2 };
// const copy = { ...obj };
// console.log(copy); // 输出: { a: 1, b: 2 }
</script>

<style></style>