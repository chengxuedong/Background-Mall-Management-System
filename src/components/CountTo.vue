<template>
    <div>
        {{ d.num.toFixed(0) }}
    </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import gsap from "gsap";

const props = defineProps({
    value: {
        typr: Number,
        default:0
    }
})

const d = reactive({
    num:0
})

function AnimateToValue()
{
    // 从0经过动画时间0.5s变化到props.value
    gsap.to(d, {
        duration: 0.5,
        num:props.value
    })
}
AnimateToValue();
watch(() => props.value,()=>AnimateToValue())
</script>