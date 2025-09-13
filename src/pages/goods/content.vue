<!-- 商品详情 -->
 <template>  
    <FormDrawer ref="formDrawerRef" title="设置商品详情"  @submit="submit">
        <el-form :model="form">
            <el-form-item>
                <Editor v-model="form.content" />
            </el-form-item>
        </el-form>
    </FormDrawer>

</template>

 <script setup>
import { ref, reactive } from 'vue';
import {
    readGoods,
    updateGoods
} from '~/api/goods';
import FormDrawer from '~/components/FormDrawer.vue';
import { toast } from '~/composables/util';
import Editor from '~/components/Editor.vue';

const formDrawerRef=ref(null)
const form = reactive({
    content:""
})


const goodsId=ref(0)
const open = (row) => {
    goodsId.value = row.id;
    row.contentLoading = true;
    readGoods(goodsId.value)
        .then(res => {
            // 拿到商品的插入内容res.content
            form.content = res.content;
            formDrawerRef.value.open();
        })
        .finally(() => {
            row.contentLoading = false;
    })
}


const emit=defineEmits(["reloadData"])
const submit = () => {
    formDrawerRef.value.showLoading();
    updateGoods(goodsId.value,form)
        .then(res => {
            toast("设置商品详情成功");
            formDrawerRef.value.close();
            //设置成功完后使用emit("reloadData")手动触发reloadData=>getData()进行刷新页面
            //还没设置轮播图时按钮是红色的设置轮播图后直接刷新页面这样按钮会变成蓝色
            emit("reloadData");
        })
        .finally(() => {
            formDrawerRef.value.hideLoading();
    })
}
//把方法暴露出去给父元素使用
defineExpose({ open });
</script>