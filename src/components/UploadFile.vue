<template>
    <el-upload drag :action="uploadImageAction" 
    multiple :headers="{ token }" 
    name="img" :data="data"
        :on-success="uploadSuccess" 
        :on-error="uploadError">
        <el-icon class=" el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
            <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
            </div>
        </template>
    </el-upload>
</template>

<script setup>
import { uploadImageAction } from '../api/image';
import { getToken } from '../composables/auth';
import { toast } from '../composables/util';
const token = getToken();
defineProps({
    data: Object,
})

const emit = defineEmits(["success"])
const uploadSuccess = (response, uploadFile, uploadFiles) => {
    if (response.msg == "ok")
        toast("上传成功");
    emit("success", { response, uploadFile, uploadFiles })
}
const uploadError = (error, uploadFile, uploadFiles) => {
    // error.message 一个字符串，描述了错误的具体内容 {"msg": "文件大小超出限制"}
    // JSON.parse(error.message)  将这个字符串解析为一个 JavaScript 对象  { msg: "文件大小超出限制" }
    // JSON.parse(error.message).msg  "文件大小超出限制"
    let msg = JSON.parse(error.message).msg||"上传失败";
    toast(msg, "error");
}
</script>