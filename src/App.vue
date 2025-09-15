<!-- 普通的script只会在组件被首次引入的时候执行一次不同,
script setup 的代码会再每次组件实例被创建的时候执行 -->
<script setup>
console.log(import.meta.env);
</script>

<template>
  <router-view></router-view>
</template>
<!-- 加了scoped元素.bar样式无法生效.bar元素不在渲染视图范围内-->
<style>

body {
  background-color: #f3f7ff;
}

#nprogress .bar {
  background: #f4f4f4!important;
  height: 3px!important;
}
/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
  height: 6px;
}

::-webkit-scrollbar-corner {
  display: block;
}

::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: rgba(0,0,0,0.2);
}

::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  border-right-color: transparent;
  border-left-color: transparent;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
