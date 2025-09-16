import { ref, reactive, computed } from 'vue';
import { toast } from './util';
//封装列表，分页，搜索，删除，修改状态
interface UseInitTableOptions {
    getList: (page: number, searchForm?: any) => Promise<any>;
    delete: (ids: number[] | number) => Promise<any>;
    updateStatus: (ids: number[] | number, status: any) => Promise<any>;
    onGetListSuccess?: (res: any) => void;
    searchForm?: Record<string, any>;
}

export function useInitTable(opt: UseInitTableOptions = {} as UseInitTableOptions) {
    let searchForm: Record<string, any> | null = null
    let resetSearchForm: (() => void) | null = null
    //如果搜索表单有传值进来，就进行初始化
    if (opt.searchForm) {
        //{ ...opt.searchForm } 是一个解构操作，它会创建一个新对象，
        // 并将 opt.searchForm 的所有属性复制到新对象中。
        //避免直接修改传入的 opt.searchForm,将搜索表单对象转换为响应式对象后，
        // Vue 能够自动检测到其属性值的变化，并触发视图更新。
        searchForm = reactive({ ...opt.searchForm })
        //用户可以通过调用 resetSearchForm 方法将搜索表单的值恢复到初始状态。
        resetSearchForm = () => {
            for (const key in opt.searchForm) {
                if (searchForm) {
                    searchForm[key] = opt.searchForm[key];
                }
            }
            //调用 getData 方法确保表格数据与搜索表单的值保持一致，从而实现动态筛选功能。
            getData();
        }
    }
    const tableData = ref([]);
    const loading = ref(false);
    //分页部分
    const currentPage = ref(1)
    //总条数
    const total = ref(0)
    //每页限制显示几条
    const limit = ref(10)


    //获取数据
    function getData(currentP = null) {
        //有传当前页码
        if (typeof currentP == "number") {
            currentPage.value = currentP;
        }
        loading.value = true;
        //以后凡是用到搜索或者分页都可以通用这个opt.getList方法
        opt.getList(currentPage.value, searchForm)
            .then(res => {
                //opt.onGetListSuccess有属性值而且是函数，说明需要传后端数据
                if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
                    //把后端数据传出去
                    opt.onGetListSuccess(res);
                }
                else {

                    tableData.value = res.list;
                    total.value = res.totalCount;
                }
            })
            .finally(() => {
                loading.value = false;
            })
    }

    getData();

    //删除
    const handleDelete = (id: number) => {
        loading.value = true;
        opt.delete(id)
            .then(res => {
                toast("删除成功");
                getData();
            })
            .finally(() => {
                loading.value = false;
            })
    }

    //修改状态
    const handleStatusChange = (status: number, row: any) => {
        row.statusLoading = true;
        opt.updateStatus(row.id, status)
            .then(res => {
                toast("修改状态成功");
                row.status = status;
                if (row.statusText == "领取中")
                    row.statusText = "已失效"

            })
            .finally(() => {
                row.statusLoading = false;
            })
    }


    //监听多选选中Id
    const multiSelectionIds = ref<number[]>([])
    const handleSelectionChange = (e: { id: number }[]) => {
        multiSelectionIds.value = e.map(o => o.id)
    }


    //批量删除   
    // 指定类型以避免 TS 报错
    const multipleTableRef = ref<{ clearSelection: () => void } | null>(null)   //拿到节点
    const handleMultiDelete = () => {
        loading.value = true;
        opt.delete(multiSelectionIds.value)
            .then(res => {
                toast("删除成功");
                //清空选中
                if (multipleTableRef.value)
                    multipleTableRef.value.clearSelection();
                getData();
            })
            .finally(() => {
                loading.value = false;
            })
    }

    //批量修改状态(商品管理批量上架下架)
    const handleMultiStatusChange = (status: any) => {
        loading.value = true;
        opt.updateStatus(multiSelectionIds.value, status)
            .then(res => {
                toast("修改状态成功");
                //清空选中
                if (multipleTableRef.value)
                    multipleTableRef.value.clearSelection();
                getData();
            })
            .finally(() => {
                loading.value = false;
            })
    }


    return {
        searchForm,
        resetSearchForm,
        tableData,
        loading,
        currentPage,
        total,
        limit,
        getData,
        handleDelete,
        handleStatusChange,
        handleSelectionChange,
        multipleTableRef,
        handleMultiDelete,
        handleMultiStatusChange,
        multiSelectionIds
    }
}
//封装新增，修改
interface UseInitFormOptions {
    form: Record<string, any>;
    rules?: Record<string, any>;
    beforeSubmit?: (form: Record<string, any>) => any;
    update?: (id: number, body: any) => Promise<any>;
    create?: (body: any) => Promise<any>;
    getData?: (page?: number | boolean) => void;
}

export function useInitForm(opt: UseInitFormOptions) {
    //表单部分
    const formDrawerRef = ref<any>(null)
    const formRef = ref<{ validate: (cb: (valid: boolean) => void) => void; clearValidate?: () => void } | null>(null)
    const defaultForm = opt.form;
    const form = reactive({} as Record<string, any>)
    //验证规则
    const rules = opt.rules || {};
    const editId = ref(0);
    const drawerTitle = computed(() => editId.value ? "修改" : "新增")
    const handleSubmit = () => {
        //点击提交按钮，会对form进行rules验证，valid是返回验证的结果
        if (!formRef.value) return;
        formRef.value.validate((valid: boolean) => {
            if (!valid)
                return;
            if (formDrawerRef.value) {
                formDrawerRef.value.showLoading();
            }

            let body = {}
            if (opt.beforeSubmit && typeof opt.beforeSubmit == "function") {
                //在提交之前先对时间字符串转为时间戳放在浅拷贝创建的新对象，原来的form没有改变，
                //浅拷贝创建一个新对象,复制 form的所有属性,修改{...form}的属性不会影响原来这个form
                body = opt.beforeSubmit({ ...form })
            }
            else {
                //是直接赋值，这个shallo任何修改都会直接影响原对象form,是指向同一个对象
                body = form
            }

            const fun = editId.value
                ? (opt.update ? opt.update(editId.value, body) : Promise.reject(new Error("update 方法未定义")))
                : (opt.create ? opt.create(body) : Promise.reject(new Error("create 方法未定义")));

            fun.then(res => {
                toast(drawerTitle.value + "成功");
                //// 修改刷新当前页，新增刷新第一页
                if (opt.getData) {
                    opt.getData(editId.value ? false : 1);
                }
                formDrawerRef.value.close();
            })
                .finally(() => {
                    formDrawerRef.value.hideLoading();
                })
        })
    }
    //重置表单
    function resetForm(row: Record<string, any> = defaultForm) {
        // 用于清除表单的验证状态。这通常用于在重置表单时清除之前的验证错误信息。
        if (formRef.value && typeof formRef.value.clearValidate === "function")
            formRef.value.clearValidate();
        for (const key in defaultForm) {
            form[key] = row[key];
        }
    }
    //新增
    const handleCreate = () => {
        editId.value = 0;
        resetForm(defaultForm);
        formDrawerRef.value.open();
    }

    //编辑
    const handleEdit = (row: Record<string, any>) => {
        editId.value = row.id;
        resetForm(row);
        formDrawerRef.value.open();
    }
    return {
        formDrawerRef,
        formRef,
        form,
        rules,
        editId,
        drawerTitle,
        handleSubmit,
        resetForm,
        handleCreate,
        handleEdit
    }
}