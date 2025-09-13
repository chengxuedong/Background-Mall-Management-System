<!-- 商品轮播图 -->
 <template>
    <!-- :destroy-on-close="true" <=> destroy-on-close(简写形式)   
         v-model来控制是否显示-->
    <el-drawer title="设置轮播图" v-model="dialogVisible" size="50%" :destroy-on-close="true">
        <el-form :model="form" label-width="80px">
            <el-form-item label="轮播图">
                <ChooseImage :limit="9" v-model="form.banners" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

 <script setup>
import { ref, reactive } from 'vue';
import {
    readGoods,
    setGoodsBanner
} from '~/api/goods';
import ChooseImage from '~/components/ChooseImage.vue';
import { toast } from '~/composables/util';

const dialogVisible = ref(false)
const form = reactive({
        banners:[]
})

const goodsId=ref(0)
const open = (row) => {
    goodsId.value = row.id;
    row.bannersLoading = true;
    readGoods(goodsId.value)
        .then(res => {
            // 拿到url组成的一维数组res.goodsBanner
        form.banners=res.goodsBanner.map(o=>o.url)
        dialogVisible.value = true;
        })
        .finally(() => {
            row.bannersLoading = false;
    })
}


const emit=defineEmits(["reloadData"])
const loading=ref(false)
const submit = () => {
    loading.value = true;
    setGoodsBanner(goodsId.value,form)
        .then(res => {
            toast("设置轮播图成功");
            dialogVisible.value = false;
            //设置成功完后使用emit("reloadData")手动触发reloadData=>getData()进行刷新页面
            //还没设置轮播图时按钮是红色的设置轮播图后直接刷新页面这样按钮会变成蓝色
            emit("reloadData");
        })
        .finally(() => {
            loading.value = false;
    })
}
//把方法暴露出去给父元素使用
defineExpose({ open });
</script>

<!-- v-model：
是一个语法糖，背后依赖于 :value 和 @input。
:value：绑定输入框的值。
@input：监听输入框的 input 事件，并更新绑定的数据源。
适用于原生表单元素和内置组件。
:model：
是一个动态绑定语法，用于自定义组件。
需要在子组件中定义 props 和 emit 来实现双向绑定。 -->