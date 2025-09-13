<template>
    <!-- 管理员管理选择图片部分
     v-model的作用是将父组件的 form.avatar 绑定到子组件 ChooseImage
     的modelValue属性,并监听子组件触发的 update:modelValue 事件来更新
     form.avatar 的值。/> -->
    <!-- 判断"modelValue是url一维数组还是单个字符串类型 -->
    <div v-if="modelValue && preview">
        <el-image v-if="typeof modelValue =='string'" :src="modelValue" fit="cover"
            class="w-[100px] h-[100px] rounded border mr-2"></el-image>
        <div v-else class="flex flex-wrap">
            <!-- modelValue是url一维数组，所以可以直接拿到url-->
            <div v-for="(url,index) in modelValue" :key="index" class="relative mx-1 mb-2 w-[100px]">
                <el-icon class="absolute right-[5px] top-[5px] cursor-pointer bg-white rounded" style="z-index:10;"
                    @click="removeImage(url)">
                    <CircleClose />
                </el-icon>
                <el-image :src="url" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
            </div>
        </div>
    </div>

    <div v-if="preview" class="choose-image-btn" @click="open">
        <el-icon :size="25" class="text-gray-500">
            <Plus />
        </el-icon>
    </div>
    <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">
        <el-container class="bg-white rounded" style="height: 70vh;">
            <el-header class="image-header">
                <el-button type="primary" size="small" @click="handleOpenCreate">新增图片列表</el-button>
                <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
            </el-header>
            <el-container>
                <!--  @click="handleAsideChange"绑定在组件标签上，实现冒泡点击左侧的imageAside后会显示相应的图库信息 -->
                <ImageAside ref="ImageAsideRef" @change="handleAsideChange" />
                <ImageMain :limit="limit" openChoose ref="ImageMainRef" @choose="handleChoose" />
            </el-container>
        </el-container>
        <template #footer>
            <span>
                <el-button @click="dialogVisible= false">取消</el-button>
                <el-button type="primary" @click="submit">确认</el-button>
            </span>
        </template>
    </el-dialog>

</template>
<script setup>
import { ref } from 'vue';
import { toast } from '../composables/util';
import ImageAside from '~/components/ImageAside.vue';
import ImageMain from '~/components/ImageMain.vue';

const ImageAsideRef = ref(null)
// ref 是 Vue 提供的一种机制，用于在父组件中获取子组件的实例。
// 当你在子组件上使用 ref 时，Vue 会在组件实例化后，将子组件的实例存储到 ref 的 value 属性中。
// 在子组件中定义的任何方法（如 handleCreate）都可以通过子组件的实例访问。
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const dialogVisible = ref(false);

const callbackFunction = ref(null);

const open = (callback=null) => {
    callbackFunction.value=callback
    dialogVisible.value = true;
}
const close = () => {
    dialogVisible.value = false;
}
const ImageMainRef = ref(null)
//ImageMainRef.value获取绑定了ref="ImageMainRef"的节点
//当 ImageAside 组件触发 click 事件时，调用 ImageMain 组件的 loadData 方法。
// image_class_id 是从 ImageAside 传递过来的分类 id。
// loadData 方法用于根据分类 id 加载对应的图片列表。
const handleAsideChange = (image_class_id) => ImageMainRef.value.loadData(image_class_id);
const handleOpenUpload = () => ImageMainRef.value.openUploadFile();


const props = defineProps({
    modelValue: [String, Array],
    limit: {
        type: Number,
        default:1
    },
    preview: {
        type: Boolean,
        //默认出现添加图片的加号标识
        default:true
    }
})

const emit=defineEmits(["update:modelValue"])
let urls = [];
const handleChoose = (e) => {
    // e是选中的图片
    urls = e.map(o => o.url);
}
const submit = () => {
    let value = []
    if (props.limit == 1)
        value = urls[0];
    else
    {
        //props.preview为true时,把老数组和新数组进行合并
        //商品详情(props.preview为false)这一块没有传递modelValue报错
        value = props.preview ? [...props.modelValue, ...urls] : [...urls];
        //如果新的选中的图片超过最大图片数量弹出提示框还有用return阻止更新modelValue
        if (value.length > props.limit)
        {
            let limit = props.preview ? (props.limit - props.modelValue.length) : props.limit;
            return toast("最多还能选择" + limit + "张");  
        }
    }


    if (value &&props.preview)
    {
        emit("update:modelValue", value);
    }
    //为商品详情的情况时
    if (!props.preview &&typeof callbackFunction.value=="function") {
        //把选中的值传进去
        callbackFunction.value(value);
    }
    close();
}

const removeImage = (url) => {
    //modelValue=props.modelValue.filter(u=>u!=url)   不等于url的都留下来
    emit("update:modelValue", props.modelValue.filter(u=>u!=url));
}

defineExpose({
    open
})
</script>

<style>
.image-header {
    border-bottom: 1px solid #eee;
    @apply flex items-center;
}

.choose-image-btn {
    @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}
</style>