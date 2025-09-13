<!-- 规格值Tag -->
<template>
    <div class="flex gap-2">
        <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
            {{ tag }}
        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag" size="small" @click="showInput">
            + 添加值
        </el-button>
    </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'

//接收v-model传进来的值
const props=defineProps({
    modelValue:String
})

const emit = defineEmits(["update:modelValue"])
const inputValue = ref('')
const dynamicTags = ref(props.modelValue ? props.modelValue.split(','):[])
const inputVisible = ref(false)
const InputRef = ref()

//删除之后也要进行更新数据
const handleClose = (tag) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
    emit("update:modelValue", dynamicTags.value.join(","))
}

const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value.input.focus()
    })
}

const handleInputConfirm = () => {
    //点击回车进行添加规格值把它推进数组
    if (inputValue.value) {
        dynamicTags.value.push(inputValue.value)
        //通知父组件，新的数组以,分割符串成字符串传回父组件，然后修改v-model的值进行赋值处理
        emit("update:modelValue", dynamicTags.value.join(","))
    }
    inputVisible.value = false
    inputValue.value = ''
}
</script>