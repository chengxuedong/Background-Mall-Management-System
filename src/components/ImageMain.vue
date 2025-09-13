<template>
    <el-main class="image-main" v-loading="loading">
        <div class="top p-3">
            <!-- :gutter="10"每一列的间距 -->
            <el-row :gutter="10">
                <el-col v-for="(item, index) in list" :key="index" :span="6" :offset="0">
                    <!-- 选中加上 border-blue-500-->
                    <el-card shadow="hover" class="relative" :class="{'border-blue-500':item.checked}"
                        :body-style="{ 'padding': 0 }">
                        <el-image :src="item.url" fit="cover" class="w-full h-[150px]" :preview-src-list="[item.url]"
                            :initial-index="0">
                        </el-image>
                        <div class="image-title">{{ item.name }}</div>
                        <div class="flex items-center justify-center p-2">
                            <el-checkbox v-if="openChoose" v-model="item.checked" @change="handleChooseChange(item)" />

                            <el-button type="primary" size="small" text @click="handleEdit(item)">重命名</el-button>
                            <el-popconfirm title="是否要删除该图片？" confirm-button-text="确认" cancel-button-text="取消"
                                @confirm="handleDelete(item.id)">
                                <template #reference>
                                    <el-button class="!m-0" type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev,pager,next" :total="total" :currentPage="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
    </el-main>
    <el-drawer v-model="drawer" title="上传图片">
        <UploadFile :data="{image_class_id}" @success="handleUploadSuccess" />
    </el-drawer>
</template>
<script setup>
import {
    getImageList,
    updateImage,
    deleteImage
} from '../api/image';
import { showPrompt, toast } from '../composables/util';
import { computed, ref } from 'vue';
import UploadFile from './UploadFile.vue';
import { type } from 'windicss/utils';

//上传图片
const drawer =ref(false)
const openUploadFile = () => drawer.value = true;
//分页部分
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

const list = ref([])
const loading = ref(false)
//当前图库id
const image_class_id = ref(0)
//获取数据
function getData(currentP = null) {
    if (typeof currentP == "number") {
        currentPage.value = currentP;
    }
    loading.value = true;
    getImageList(image_class_id.value, currentPage.value)
        .then(res => {
            total.value = res.totalCount;
            list.value = res.list.map(o => {
                o.checked = false;
                return o;
            });
        })
        .finally(() => {
            loading.value = false;
        })
}

//根据分类id重新加载图片列表
const loadData = (id) => {
    currentPage.value = 1;
    image_class_id.value = id;
    getData();
}

//重命名
const handleEdit = (item) => {
    // 把value从res中解构出来拿到图片名字
    showPrompt("重命名", item.name)
        .then(({ value }) => {

            loading.value = true;
            updateImage(item.id, value)
                .then(res => {
                    toast("修改成功");
                    getData();
                })
                .finally(() => {
                    loading.value = false;
                })
        })
}

//删除图片
const handleDelete = (id) => {
    loading.value = true;
    deleteImage([id])
        .then(() => {
            toast("删除成功");
            getData();
        })
        .finally(() => {
            loading.value = false;
        })
}

//用props来接手方便使用limit
const props=defineProps({
    openChoose: {
        type: Boolean,
        default:false
    },
    limit: {
        type: Number,
        default:1
    }
})

//选中的图片
const emit=defineEmits(["choose"])
const checkedImage = computed(() => list.value.filter(o=>o.checked==true))
const handleChooseChange = (item) => {
    if (item.checked && checkedImage.value.length > props.limit)
    {
        item.checked = false;
        return toast(`最多只能选择${props.limit}张`, "error");
    }
    emit("choose", checkedImage.value);
}
//上传成功
const handleUploadSuccess = () => getData(1);
defineExpose({
    loadData,
    openUploadFile
})
</script>
<style>
.image-main {
    position: relative;
}

.image-main .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-main .bottom {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0px;
    height: 50px;
    @apply flex items-center justify-center;
}

.image-title {
    position: absolute;
    top: 122px;
    left: -1px;
    right: -1px;
    @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>