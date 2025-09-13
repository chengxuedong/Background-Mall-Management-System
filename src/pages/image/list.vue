<template>
    <div>
        <el-container class="bg-white rounded" :style="{ height: h + 'px' }">
            <el-header class="image-header">
                <el-button type="primary" size="small" @click="handleOpenCreate">新增图片列表</el-button>
                <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
            </el-header>
            <el-container>
                <!--  @click="handleAsideChange"绑定在组件标签上，实现冒泡点击左侧的imageAside后会显示相应的图库信息 -->
                <ImageAside ref="ImageAsideRef" @change="handleAsideChange" />
                <ImageMain ref="ImageMainRef" />
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ImageAside from '../../components/ImageAside.vue';
import ImageMain from '../../components/ImageMain.vue';

// 拿到浏览器可视部分的高度
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40;
const ImageAsideRef = ref(null)
// ref 是 Vue 提供的一种机制，用于在父组件中获取子组件的实例。
// 当你在子组件上使用 ref 时，Vue 会在组件实例化后，将子组件的实例存储到 ref 的 value 属性中。
// 在子组件中定义的任何方法（如 handleCreate）都可以通过子组件的实例访问。
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const ImageMainRef = ref(null)
//ImageMainRef.value获取绑定了ref="ImageMainRef"的节点
//当 ImageAside 组件触发 click 事件时，调用 ImageMain 组件的 loadData 方法。
// image_class_id 是从 ImageAside 传递过来的分类 id。
// loadData 方法用于根据分类 id 加载对应的图片列表。
const handleAsideChange = (image_class_id) => ImageMainRef.value.loadData(image_class_id);
const handleOpenUpload = () => ImageMainRef.value.openUploadFile();
</script>

<style scoped>
.image-header {
    border-bottom: 1px solid #eee;
    @apply flex items-center;
}
.el-button {
    padding: 15px 10px;
}
</style>